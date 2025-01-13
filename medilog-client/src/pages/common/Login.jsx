import { Link, useLocation, useNavigate } from "react-router-dom";
import "animate.css";
import { Helmet } from "react-helmet";
import { AuthContext } from "../../providers/AuthProviders";
import Swal from "sweetalert2";
import { useContext, useState } from "react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signInUser, setUser, googleSignIn } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then((result) => {
                setUser(result.user);
                const redirectPath = location.state?.from?.pathname || "/";
                navigate(redirectPath, { replace: true });
                Swal.fire({
                    title: "Success!",
                    text: "Logged in successfully with Google!",
                    icon: "success",
                });
            })
            .catch((err) => {
                Swal.fire({
                    title: "Error!",
                    text: err.message,
                    icon: "error",
                });
            });
    };

    const handleLogin = (event) => {
        event.preventDefault();

        // Password validation
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
        if (!/[a-z]/.test(password)) {
            setPasswordError("Password must include at least one lowercase letter.");
            return;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setPasswordError("Password must include at least one special character.");
            return;
        }

        setPasswordError(""); // Clear error if validation passes

        signInUser(email, password)
            .then((result) => {
                setUser(result.user);
                const redirectPath = location.state?.from?.pathname || "/";
                navigate(redirectPath, { replace: true });
                Swal.fire({
                    title: "Success!",
                    text: "Logged in successfully!",
                    icon: "success",
                });
            })
            .catch((err) => {
                Swal.fire({
                    title: "Error!",
                    text: err.message,
                    icon: "error",
                });
            });
    };

    return (
        <section className="bg-gray-100 py-36 p-3">
            <Helmet>
                <title>Medilog | Login</title>
            </Helmet>
            <div className="card w-full max-w-sm shadow-2xl mx-auto animate__animated animate__fadeIn animate__slower">
                <h2 className="text-3xl font-bold text-center p-5 text-c3">Login</h2>
                <form className="card-body" onSubmit={handleLogin}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="input input-bordered"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 cursor-pointer text-gray-500 text-2xl"
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </span>
                        </div>
                        {passwordError && (
                            <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                        )}
                    </div>

                    <div className="form-control mt-6">
                        <button
                            type="submit"
                            className="btn bg-blue-600 text-white border-none"
                        >
                            Login
                        </button>
                    </div>

                    <div className="mt-4">
                        <button
                            onClick={handleGoogleSignIn}
                            type="button"
                            className="btn w-full flex items-center gap-3 bg-white border text-black hover:bg-gray-200"
                        >
                            <img
                                src="https://i.ibb.co/WnqDNrk/google.png"
                                alt="Google Icon"
                                className="w-5 h-5"
                            />
                            Continue with Google
                        </button>
                    </div>

                    <div className="mt-4 text-center dark:text-white">
                        <p className="text-sm">
                            Don&apos;t have an account?{" "}
                            <Link to="/register" className="link link-hover text-c2 font-bold">
                                Register
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Login;
