import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const Register = () => {
    const handleRegister = (event) => {
        event.preventDefault();
    }
    return (
        <section>
            <Helmet>
                <title>Medilog | Sign Up</title>
            </Helmet>
            <section className="bg-gray-100 py-36">
                <div className="card w-full max-w-sm shadow-2xl mx-auto animate__animated animate__fadeIn animate__slower">
                    <h2 className="text-3xl font-bold text-center p-5 text-c3">Register</h2>
                    <form className="card-body">
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

                                    placeholder="Password"
                                    className="input input-bordered w-full"
                                    required
                                />
                                <span

                                    className="absolute right-3 top-3 cursor-pointer text-gray-500 text-2xl"
                                >

                                </span>
                            </div>

                        </div>

                        <div className="form-control mt-6">
                            <button type="submit" className="btn bg-blue-600 text-white border-none">
                                Login
                            </button>
                        </div>

                        <div className="mt-4 text-center">
                            <p className="text-sm">
                                Don&apos;t have an account?{" "}
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