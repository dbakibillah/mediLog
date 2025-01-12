import axios from "axios";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../providers/AuthProviders";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Register = () => {
    const navigate = useNavigate();
    const { createUser, signInUser } = useContext(AuthContext);

    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async (event) => {
        event.preventDefault();

        const name = event.target.name.value.trim();
        const email = event.target.email.value.trim();
        const password = event.target.password.value.trim();
        
        // Password validation checks
        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters long.");
            return;
        }
        if (!/[0-9]/.test(password)) {
            setPasswordError("Password must include at least one number.");
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setPasswordError("Password must include at least one uppercase letter.");
            return;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setPasswordError("Password must include at least one special character.");
            return;
        }
        setPasswordError(""); // Reset password error if validation passes

        try {
            // Check if user already exists
            const response = await axios.get(`http://localhost:8081/users?email=${email}`);
            if (response.data.exists) {
                Swal.fire({
                    title: "Already registered!",
                    text: "Please log in instead.",
                    icon: "info",
                });
                navigate("/login");
                return;
            }

            // Register new user
            const newUser = { name, email };
            await axios.post("http://localhost:8081/users", newUser);
            await createUser(email, password, name);

            // After registration, log the user in automatically
            await signInUser(email, password);

            Swal.fire({
                title: "Good job!",
                text: "Registration successful and logged in!",
                icon: "success",
            });

            navigate("/"); // Redirect to the homepage after successful login
        } catch (error) {
            console.error("Error during registration:", error);
            Swal.fire({
                icon: "error",
                title: "Failed to register",
                text: error.response?.data?.message || error.message,
            });
        }
    };

    return (
        <section>
            <Helmet>
                <title>Medilog | Sign Up</title>
            </Helmet>
            <section className="bg-gray-100 py-36">
                <div className="card w-full max-w-sm shadow-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-center p-5 text-c3">Register</h2>
                    <form onSubmit={handleRegister} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input
                                name="name"
                                type="text"
                                placeholder="Name"
                                className="input input-bordered"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                className="input input-bordered"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="input input-bordered w-full"
                                    required
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 cursor-pointer text-gray-500 text-xl"
                                >
                                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                                </span>
                            </div>
                            {passwordError && (
                                <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                            )}
                        </div>

                        <div className="form-control mt-6">
                            <button type="submit" className="btn bg-blue-600 text-white border-none">
                                Register
                            </button>
                        </div>

                        <div className="mt-4 text-center">
                            <p className="text-sm">
                                Already have an account?{" "}
                                <Link to="/login" className="link link-hover text-c2 font-bold">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </section>
        </section>
    );
};

export default Register;
