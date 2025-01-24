import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProviders";
import axios from "axios";
import SearchBar from "../../components/searchBar/SearchBar";

const PatientAppointments = () => {
    const { user } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch appointments for the logged-in patient using their email
    const { data: appointments, isLoading, isError } = useQuery({
        queryKey: ["appointments", user.email],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:8081/appointments?email=${user.email}`);
            return response.data;
        },
    });

    // Show loading state
    if (isLoading) {
        return <div className="text-center text-lg text-blue-500">Loading your appointments...</div>;
    }

    // Show error state
    if (isError) {
        return <div className="text-center text-lg text-red-500">Error loading appointments. Please try again later.</div>;
    }

    // Search handler
    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    // Filter appointments based on search query
    const filteredAppointments = appointments.filter((appointment) => {
        return (
            appointment.doctor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appointment.hospital_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appointment.disease.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <section className="container mx-auto lg:px-24 p-6">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Your Appointments</h1>

            {/* Add SearchBar component here */}
            <div className="flex justify-end mb-6">
                <SearchBar onSearch={handleSearch} searchQuery="Search by doctor, hospital, or disease..." />
            </div>

            {/* Display a message if there are no appointments */}
            {filteredAppointments.length === 0 ? (
                <div className="text-center text-lg text-gray-600">No appointments found.</div>
            ) : (
                <div className="overflow-x-auto rounded-lg bg-white shadow-lg">
                    <table className="min-w-full table-auto text-sm text-gray-700">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">Date</th>
                                <th className="py-3 px-4 text-left">Time</th>
                                <th className="py-3 px-4 text-left">Doctor</th>
                                <th className="py-3 px-4 text-left">Symptoms</th>
                                <th className="py-3 px-4 text-left">Hospital</th>
                                <th className="py-3 px-4 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map((appointment) => {
                                // If the consultation date already includes time, we use it directly
                                const consultationDate = new Date(appointment.consultation_date);

                                // If the consultation_time is separate, we need to combine it
                                if (appointment.consultation_time) {
                                    const [hours, minutes] = appointment.consultation_time.split(":");
                                    consultationDate.setHours(hours);
                                    consultationDate.setMinutes(minutes);
                                }

                                return (
                                    <tr key={appointment.id} className="hover:bg-gray-100 transition-colors duration-300">
                                        <td className="py-3 px-4">{consultationDate.toLocaleDateString()}</td>
                                        <td className="py-3 px-4">
                                            {consultationDate.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td className="py-3 px-4">{appointment.doctor_name}</td>
                                        <td className="py-3 px-4">{appointment.disease}</td>
                                        <td className="py-3 px-4">{appointment.hospital_name}</td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`inline-block py-1 px-3 rounded-lg text-white ${appointment.status === "pending" ? "bg-yellow-500" : appointment.status === "completed" ? "bg-green-500" : "bg-red-500"}`}
                                            >
                                                {appointment.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default PatientAppointments;
