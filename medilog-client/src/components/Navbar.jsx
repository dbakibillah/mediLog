import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../providers/AuthProviders";
import Swal from "sweetalert2";

const Navbar = () => {
    const { user, signOutUser } = useContext(AuthContext);

    const handleLogout = () => {
        signOutUser()
            .then(() => {
                Swal.fire({
                    title: "Good job!",
                    text: "Logged out successfully!",
                    icon: "success",
                });
            })
            .catch((error) => {
                Swal.fire({
                    title: "Something went wrong!",
                    text: error.message,
                    icon: "error",
                });
            });
    };

    const links = (
        <>
            <li>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "text-blue-600 font-semibold" : "hover:text-blue-500 transition"
                    }>
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/consultation"
                    className={({ isActive }) =>
                        isActive ? "text-blue-600 font-semibold" : "hover:text-blue-500 transition"
                    }>
                    Consultation
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/diagonstic"
                    className={({ isActive }) =>
                        isActive ? "text-blue-600 font-semibold" : "hover:text-blue-500 transition"
                    }>
                    Diagnosis
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/ordertests"
                    className={({ isActive }) =>
                        isActive ? "text-blue-600 font-semibold" : "hover:text-blue-500 transition"
                    }>
                    Order Tests
                </NavLink>
            </li>
        </>
    );

    return (
        <section className="bg-gray-50 sticky top-0 z-10">
            <div className="container mx-auto px-6 lg:px-24 navbar">
                {/* Navbar Start */}
                <div className="navbar-start">
                    <div className="dropdown">
                        <button
                            tabIndex={0}
                            className="btn btn-ghost lg:hidden focus:outline-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16"
                                />
                            </svg>
                        </button>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-white rounded-md shadow-lg mt-3 w-52 p-2">
                            {links}
                        </ul>
                    </div>
                    <Link to="/" className="btn btn-ghost normal-case text-2xl font-bold text-blue-600">
                        Medilog
                    </Link>
                </div>

                {/* Navbar Center */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal space-x-6">{links}</ul>
                </div>

                {/* Navbar End */}
                <div className="navbar-end">
                    <div className="flex gap-4 items-center">
                        {user ? (
                            <div className="dropdown dropdown-end">
                                <label
                                    tabIndex={0}
                                    className="btn btn-ghost btn-circle avatar"
                                >
                                    <div
                                        className="w-12 rounded-full"
                                        data-tooltip-id="my-tooltip"
                                        data-tooltip-content={user.displayName || "User"}
                                        data-tooltip-place="bottom"
                                    >
                                        <img
                                            src={user.photoURL || "https://via.placeholder.com/150"}
                                            alt="User Avatar"
                                        />
                                    </div>
                                </label>
                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow z-10"
                                >
                                    <li>
                                        <span className="font-bold">
                                            Hello, {user.displayName || "User"}!
                                        </span>
                                    </li>
                                    <li>
                                        <Link to="/dashboard"
                                            className="btn btn-ghost"
                                        >
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="btn btn-ghost"
                                        >
                                            Log Out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <span className="flex gap-2">
                                <Link to="/login" className="btn btn-ghost">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-ghost">
                                    Register
                                </Link>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Navbar;
