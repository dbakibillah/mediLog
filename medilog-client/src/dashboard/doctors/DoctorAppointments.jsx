import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProviders";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const DoctorAppointments = () => {
    const { user } = useContext(AuthContext);

    // Fetching appointments for the logged-in doctor
    const { data: appointments = [], isLoading, isError, error } = useQuery({
        queryKey: ["appointments", user?.email],
        queryFn: async () => {
            const response = await axios.get(
                `http://localhost:8081/doctor-appointments?email=${user.email}`
            );
            return response.data;
        },
        enabled: !!user?.email, // Ensure user email exists before making the request
    });

    if (isLoading) {
        return <div className="text-center text-xl text-gray-600">Loading your appointments...</div>;
    }

    if (isError) {
        return (
            <div className="text-center text-xl text-red-500">
                Error fetching your appointments: {error?.message || "An error occurred"}
            </div>
        );
    }

    // Separate upcoming and past appointments
    const today = new Date();
    const upcomingAppointments = appointments.filter(
        (appointment) => new Date(appointment.consultation_date) > today
    );
    const pastAppointments = appointments.filter(
        (appointment) => new Date(appointment.consultation_date) <= today
    );

    // Format date and time
    const formatDateTime = (dateStr, timeStr) => {
        const formattedDate = new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const formattedTime = new Date(`1970-01-01T${timeStr}Z`).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
        return { formattedDate, formattedTime };
    };

    const renderAppointments = (appointments, title) => (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
            {appointments.length > 0 ? (
                appointments.map((appointment) => {
                    const { formattedDate, formattedTime } = formatDateTime(
                        appointment.consultation_date,
                        appointment.consultation_time
                    );
                    return (
                        <div
                            key={appointment.id}
                            className="bg-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-all duration-300 ease-in-out"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-gray-800">{appointment.patient_name}</h3>
                                <div className="flex items-center">
                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-semibold ${appointment.status === "pending"
                                                ? "bg-yellow-300 text-yellow-800"
                                                : appointment.status === "confirmed"
                                                    ? "bg-green-300 text-green-800"
                                                    : "bg-gray-300 text-gray-800"
                                            }`}
                                    >
                                        {appointment.status.charAt(0).toUpperCase() +
                                            appointment.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-2 text-gray-600">
                                <p>
                                    <strong>Consultation Date:</strong> {formattedDate}
                                </p>
                                <p>
                                    <strong>Consultation Time:</strong> {formattedTime}
                                </p>
                                <p>
                                    <strong>Disease:</strong> {appointment.disease}
                                </p>
                                <p>
                                    <strong>Doctor:</strong> {appointment.doctor_name}
                                </p>
                                <p>
                                    <strong>Hospital:</strong> {appointment.hospital_name}
                                </p>
                                <p>
                                    <strong>Notes:</strong> {appointment.additional_notes}
                                </p>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-center text-gray-600">No {title.toLowerCase()}.</p>
            )}
        </div>
    );

    return (
        <section className="container mx-auto lg:px-24 py-8 bg-gray-50">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Your Appointments</h1>
            {renderAppointments(upcomingAppointments, "Upcoming Appointments")}
            {renderAppointments(pastAppointments, "Past Appointments")}
        </section>
    );
};

export default DoctorAppointments;
