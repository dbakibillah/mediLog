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
                to="/dashboard/admin-dashboard"
                className={({ isActive }) =>
                    `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
                    }`
                }
            >
                Dashboard
            </NavLink>
            <NavLink
                to="/dashboard/manage-doctors"
                className={({ isActive }) =>
                    `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
                    }`
                }
            >
                Doctors
            </NavLink>
            <NavLink
                to="/dashboard/admin-appointments"
                className={({ isActive }) =>
                    `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
                    }`
                }
            >
                Appointments
            </NavLink>
        </li>
    );

    const patientLinks = (
        <li>
            <NavLink
                to="/dashboard/patient-dashboard"
                className={({ isActive }) =>
                    `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
                    }`
                }
            >
                Dashboard
            </NavLink>
            <NavLink
                to="/dashboard/patient-appointments"
                className={({ isActive }) =>
                    `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
                    }`
                }
            >
                Appointments
            </NavLink>
            <NavLink
                to="/dashboard/patient-medical-records"
                className={({ isActive }) =>
                    `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
                    }`
                }
            >
                Medical Records
            </NavLink>
            <NavLink
                to="/dashboard/patient-prescriptions"
                className={({ isActive }) =>
                    `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
                    }`
                }
            >
                Prescriptions
            </NavLink>
        </li>
    );

    return (
        <section className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col lg:flex-row">
            <aside className="lg:w-2/12 w-full bg-blue-600 dark:bg-gray-950 text-white flex flex-col shadow-lg">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                    <nav>
                        <ul className="space-y-2">{userType === "admin" ? adminLinks : patientLinks}</ul>
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
