import { Link } from "react-router-dom";
import 'animate.css';
import { Helmet } from "react-helmet";

const Login = () => {
    return (
        <section className="bg-gray-100 py-36 p-3">
            <Helmet>
                <title>Medilog | Login</title>
            </Helmet>
            <div className="card w-full max-w-sm shadow-2xl mx-auto animate__animated animate__fadeIn animate__slower">
                <h2 className="text-3xl font-bold text-center p-5 text-c3">Login</h2>
                <form className="card-body">

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

                    <div className="mt-4">
                        <button
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