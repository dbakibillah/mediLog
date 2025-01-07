import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
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
                    <Link
                        to="/login"
                        className="btn btn-ghost px-5 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                        Login
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Navbar;
