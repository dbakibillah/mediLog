import { useContext, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProviders";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const { data: userType, isLoading } = useQuery(["userType", user?.email], async () => {
        if (!user?.email) return null;
        const response = await axios.get(`http://localhost:8081/users/${user.email}`);
        return response.data;
    });

    useEffect(() => {
        if (userType) {
            navigate(userType === "admin" ? "" : "");
        }
    }, [userType, navigate]);

    if (isLoading) {
        return (
            <div className="text-center text-lg font-medium text-gray-400 py-10">
                <p>Loading...</p>
            </div>
        );
    }

    const adminLinks = (
        <li>
            <NavLink
                to="/dashboard/manage-feedbacks"
                className={({ isActive }) =>
                    `block px-5 py-3 rounded-lg transition-all ${
                        isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
                    }`
                }
            >
                Manage Feedbacks
            </NavLink>
        </li>
    );

    const userLinks = (
        <li>
            <NavLink
                to="/dashboard/appointments"
                className={({ isActive }) =>
                    `block px-5 py-3 rounded-lg transition-all ${
                        isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
                    }`
                }
            >
                Appointments
            </NavLink>
            <NavLink
                to="/dashboard/your-feedback"
                className={({ isActive }) =>
                    `block px-5 py-3 rounded-lg transition-all ${
                        isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
                    }`
                }
            >
                Your Feedback
            </NavLink>
        </li>
    );

    return (
        <section className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col lg:flex-row">
            <aside className="lg:w-2/12 w-full bg-blue-600 dark:bg-gray-950 text-white flex flex-col shadow-lg">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                    <nav>
                        <ul className="space-y-2">{userType === "admin" ? adminLinks : userLinks}</ul>
                    </nav>
                    <div className="divider"></div>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/"
                                className="block px-5 py-3 rounded-lg transition-all hover:bg-blue-700"
                            >
                                Home
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>
            <div className="lg:w-10/12 w-full bg-gray-100 dark:bg-gray-900 shadow-lg">
                <Outlet />
            </div>
        </section>
    );
};

export default Dashboard;
