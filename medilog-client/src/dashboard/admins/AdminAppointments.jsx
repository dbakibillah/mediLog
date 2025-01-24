import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

const AdminAppointments = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const { data: appointments = [], isLoading, isError } = useQuery({
        queryKey: ["appointments"],
        queryFn: async () => {
            const response = await axios.get("http://localhost:8081/appointments");
            return response.data;
        },
    });

    const [openModal, setOpenModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const handleViewDetails = (appointment) => {
        setSelectedAppointment(appointment);
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
        setSelectedAppointment(null);
    };

    // Pagination logic
    const totalItems = appointments.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedData = appointments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (isLoading) {
        return <p className="text-center text-gray-500">Loading appointments...</p>;
    }

    if (isError) {
        return (
            <p className="text-center text-red-500">
                Failed to load appointments. Please try again later.
            </p>
        );
    }

    return (
        <section className="p-6 bg-gray-100 min-h-screen">
            <div className="container mx-auto lg:px-24">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Appointments</h1>
                {appointments.length === 0 ? (
                    <p className="text-center text-gray-500">No appointments available.</p>
                ) : (
                    <>
                        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="py-3 px-4 text-left">Patient Name</th>
                                    <th className="py-3 px-4 text-left">Doctor</th>
                                    <th className="py-3 px-4 text-left">Symptoms</th>
                                    <th className="py-3 px-4 text-left">Hospital</th>
                                    <th className="py-3 px-4 text-left">Date</th>
                                    <th className="py-3 px-4 text-left">Time</th>
                                    <th className="py-3 px-4 text-left">Status</th>
                                    <th className="py-3 px-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((appointment) => (
                                    <tr
                                        key={appointment.id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="py-3 px-4">{appointment.patient_name}</td>
                                        <td className="py-3 px-4">{appointment.doctor_name}</td>
                                        <td className="py-3 px-4">{appointment.disease}</td>
                                        <td className="py-3 px-4">{appointment.hospital_name}</td>
                                        <td className="py-3 px-4">
                                            {new Date(appointment.consultation_date).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4">{appointment.consultation_time}</td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-3 py-1 text-white rounded ${appointment.status === "pending"
                                                        ? "bg-yellow-500"
                                                        : appointment.status === "approved"
                                                            ? "bg-green-500"
                                                            : "bg-red-500"
                                                    }`}
                                            >
                                                {appointment.status.charAt(0).toUpperCase() +
                                                    appointment.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <button
                                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                                onClick={() => handleViewDetails(appointment)}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <div className="flex justify-center items-center mt-6">
                            <button
                                className="px-4 py-2 mx-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    className={`px-4 py-2 mx-1 ${page === currentPage
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                                        } rounded`}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                className="px-4 py-2 mx-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>

            {selectedAppointment && (
                <Modal open={openModal} onClose={closeModal} center>
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-4">Appointment Details</h2>
                        <p><strong>Patient Name:</strong> {selectedAppointment.patient_name}</p>
                        <p><strong>Patient Email:</strong> {selectedAppointment.patient_email}</p>
                        <p><strong>Doctor:</strong> {selectedAppointment.doctor_name}</p>
                        <p><strong>Hospital:</strong> {selectedAppointment.hospital_name}</p>
                        <p>
                            <strong>Consultation Date:</strong>{" "}
                            {new Date(selectedAppointment.consultation_date).toLocaleDateString()}
                        </p>
                        <p><strong>Consultation Time:</strong> {selectedAppointment.consultation_time}</p>
                        <p><strong>Symptoms:</strong> {selectedAppointment.disease}</p>
                        <p><strong>Additional Notes:</strong> {selectedAppointment.additional_notes}</p>
                        <p>
                            <strong>Status:</strong>{" "}
                            <span
                                className={`px-3 py-1 text-white rounded ${selectedAppointment.status === "pending"
                                        ? "bg-yellow-500"
                                        : selectedAppointment.status === "approved"
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                    }`}
                            >
                                {selectedAppointment.status.charAt(0).toUpperCase() +
                                    selectedAppointment.status.slice(1)}
                            </span>
                        </p>
                    </div>
                </Modal>
            )}
        </section>
    );
};

export default AdminAppointments;
