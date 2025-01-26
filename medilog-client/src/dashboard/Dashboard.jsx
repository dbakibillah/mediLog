import { useContext, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProviders";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaHome, FaNotesMedical } from "react-icons/fa";
import { MdDashboardCustomize, MdNoteAdd } from "react-icons/md";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fetch user type from the backend based on the logged-in user's email
    const { data: userType, isLoading } = useQuery(["userType", user?.email], async () => {
        if (!user?.email) return null;
        const response = await axios.get(`http://localhost:8081/users/${user.email}`);
        return response.data;
    });

    useEffect(() => {
        // Logic to redirect user if needed (based on user type)
        if (userType) {
            navigate(userType === "admin" ? "/dashboard/admin-dashboard" : userType === "doctor" ? "/dashboard/doctor-dashboard" : "/dashboard/patient-dashboard");
        }
    }, [userType, navigate]);

    if (isLoading) {
        return (
            <div className="text-center text-lg font-medium text-gray-400 py-10">
                <p>Loading...</p>
            </div>
        );
    }

    // Links for admin user type
    const adminLinks = (
        <li>
            <NavLink to="/dashboard/admin-dashboard" className={({ isActive }) => `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`}>Dashboard</NavLink>
            <NavLink to="/dashboard/admin-patients" className={({ isActive }) => `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`}>Patients</NavLink>
            <NavLink to="/dashboard/manage-doctors" className={({ isActive }) => `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`}>Doctors</NavLink>
            <NavLink to="/dashboard/admin-appointments" className={({ isActive }) => `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`}>Appointments</NavLink>
        </li>
    );

    // Links for patient user type
    const patientLinks = (
        <li>
            <NavLink to="/dashboard/patient-dashboard" className={({ isActive }) => `px-5 py-3 rounded-lg transition-all flex items-center gap-2 ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`}><MdDashboardCustomize className="text-xl" />Dashboard</NavLink>
            <NavLink to="/dashboard/patient-appointments" className={({ isActive }) => `px-5 py-3 rounded-lg transition-all flex items-center gap-2 ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`}><MdNoteAdd className="text-xl" />Appointments</NavLink>
            <NavLink to="/dashboard/patient-medical-records" className={({ isActive }) => `px-5 py-3 rounded-lg transition-all flex items-center gap-2 ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`}><FaNotesMedical className="text-xl" /> Medical Records</NavLink>
            <NavLink to="/dashboard/patient-prescriptions" className={({ isActive }) => `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`}>Prescriptions</NavLink>
        </li>
    );

    // Links for doctor user type
    const doctorLinks = (
        <li>
            <NavLink to="/dashboard/doctor-dashboard" className={({ isActive }) => `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`}>Dashboard</NavLink>
            <NavLink to="/dashboard/doctor-appointments" className={({ isActive }) => `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`}>Appointments</NavLink>
            <NavLink to="/dashboard/doctor-patients" className={({ isActive }) => `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`}>Patients</NavLink>
        </li>
    );

    return (
        <section className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col lg:flex-row">
            <aside className="lg:w-2/12 w-full bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-900 dark:via-blue-950 dark:to-blue-800 text-white flex flex-col shadow-lg">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                    <nav>
                        <ul className="space-y-2">
                            {userType === "admin" && adminLinks}
                            {userType === "patient" && patientLinks}
                            {userType === "doctor" && doctorLinks}
                        </ul>
                    </nav>
                    <div className="divider"></div>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/" className="px-5 py-3 rounded-lg transition-all hover:bg-blue-700 flex items-center gap-2"><FaHome className="text-xl" /> Home</Link>
                            <NavLink to="/dashboard/profile" className={({ isActive }) => `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`}>Profile</NavLink>
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
