import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import Calendar from "react-calendar"; // Calendar component for upcoming appointments
import "react-calendar/dist/Calendar.css"; // Calendar styles
import Chart from "chart.js/auto"; // For graphical representation of medical tests
import { Line } from "react-chartjs-2"; // Line chart for test records

const PatientAppointments = () => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date()); // For calendar date selection
    const [createModalOpen, setCreateModalOpen] = useState(false); // State to manage the create appointment modal
    const [newAppointmentDetails, setNewAppointmentDetails] = useState({
        date: "",
        time: "",
        doctor: "",
        hospital: "",
        patientName: "",
    }); // State for new appointment details

    // Fetch appointments from the database
    const { data: appointments = [], isLoading, isError } = useQuery({
        queryKey: ["patientAppointments"],
        queryFn: async () => {
            const response = await axios.get("http://localhost:8081/appointments");
            return response.data;
        },
    });

    // Filter appointments for the selected date
    const upcomingAppointments = appointments.filter(
        (appointment) =>
            new Date(appointment.consultation_date).toDateString() ===
            selectedDate.toDateString()
    );

    // Handle opening and closing the modal
    const handleViewDetails = (appointment) => {
        setSelectedAppointment(appointment);
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
        setSelectedAppointment(null);
    };

    const handleCreateAppointmentModalOpen = () => {
        setCreateModalOpen(true);
    };

    const handleCreateAppointmentModalClose = () => {
        setCreateModalOpen(false);
        setNewAppointmentDetails({
            date: "",
            time: "",
            doctor: "",
            hospital: "",
            patientName: "",
        });
    };

    const handleCreateAppointmentSubmit = async () => {
        try {
            // Submit the new appointment data to the server (this could be an axios POST request)
            await axios.post("http://localhost:8081/appointments", newAppointmentDetails);
            // Close the modal and reset the form
            handleCreateAppointmentModalClose();
        } catch (error) {
            console.error("Error creating appointment", error);
        }
    };

    // Data for medical test graph
    const testGraphData = {
        labels: ["January", "February", "March", "April", "May"], // Example months
        datasets: [
            {
                label: "Blood Sugar Level",
                data: [95, 110, 105, 100, 90],
                fill: false,
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgba(255, 99, 132, 0.2)",
            },
            {
                label: "Cholesterol Level",
                data: [180, 200, 190, 170, 160],
                fill: false,
                backgroundColor: "rgb(54, 162, 235)",
                borderColor: "rgba(54, 162, 235, 0.2)",
            },
        ],
    };

    if (isLoading) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    if (isError) {
        return (
            <p className="text-center text-red-500">
                Failed to load data. Please try again later.
            </p>
        );
    }

    return (
        <section className="p-6 bg-gray-100 min-h-screen">
            <div className="container mx-auto lg:px-24">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">My Appointments</h1>
                
                {/* Create Appointment Bar */}
                <div
                    onClick={handleCreateAppointmentModalOpen}
                    className="cursor-pointer bg-blue-500 text-white p-4 rounded-lg text-center"
                >
                    Create New Appointment
                </div>

                {appointments.length === 0 ? (
                    <p className="text-center text-gray-500">No appointments available.</p>
                ) : (
                    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200 text-gray-700">
                            <tr>
                                <th className="py-3 px-4 text-left">Patient Name</th>
                                <th className="py-3 px-4 text-left">Doctor</th>
                                <th className="py-3 px-4 text-left">Hospital</th>
                                <th className="py-3 px-4 text-left">Date</th>
                                <th className="py-3 px-4 text-left">Time</th>
                                <th className="py-3 px-4 text-left">Status</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment) => (
                                <tr
                                    key={appointment.id}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="py-3 px-4">{appointment.patient_name}</td>
                                    <td className="py-3 px-4">{appointment.doctor_name}</td>
                                    <td className="py-3 px-4">{appointment.hospital_name}</td>
                                    <td className="py-3 px-4">
                                        {new Date(appointment.consultation_date).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4">{appointment.consultation_time}</td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-3 py-1 text-white rounded ${
                                                appointment.status === "pending"
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
                )}

                <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-6">Upcoming Appointments</h2>
                <div className="flex flex-col lg:flex-row bg-white p-6 shadow-md rounded-lg gap-6">
                    {/* Calendar for selecting date */}
                    <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        className="shadow-md rounded"
                    />

                    {/* Appointments on selected date */}
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Appointments on {selectedDate.toDateString()}
                        </h3>
                        {upcomingAppointments.length > 0 ? (
                            <ul className="list-disc ml-5 text-gray-600">
                                {upcomingAppointments.map((appointment) => (
                                    <li key={appointment.id}>
                                        {appointment.consultation_time} with Dr.{" "}
                                        {appointment.doctor_name} at{" "}
                                        {appointment.hospital_name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No appointments on this date.</p>
                        )}
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-6">Medical Tests</h2>
                <div className="bg-white p-6 shadow-md rounded-lg">
                    <Line data={testGraphData} />
                </div>
            </div>

            {/* Appointment Details Modal */}
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
                        <p><strong>Status:</strong> {selectedAppointment.status}</p>
                        <p><strong>Notes:</strong> {selectedAppointment.additional_notes}</p>
                    </div>
                </Modal>
            )}

            {/* Create Appointment Modal */}
            <Modal open={createModalOpen} onClose={handleCreateAppointmentModalClose} center>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Create Appointment</h2>
                    <label className="block mb-2">Patient Name:</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded mb-4"
                        value={newAppointmentDetails.patientName}
                        onChange={(e) =>
                            setNewAppointmentDetails({
                                ...newAppointmentDetails,
                                patientName: e.target.value,
                            })
                        }
                    />
                    <label className="block mb-2">Date:</label>
                    <Calendar
                        onChange={(date) =>
                            setNewAppointmentDetails({
                                ...newAppointmentDetails,
                                date: date,
                            })
                        }
                        value={newAppointmentDetails.date || selectedDate}
                        className="shadow-md rounded mb-4"
                    />
                    <label className="block mb-2">Time:</label>
                    <input
                        type="time"
                        className="w-full p-2 border rounded mb-4"
                        value={newAppointmentDetails.time}
                        onChange={(e) =>
                            setNewAppointmentDetails({
                                ...newAppointmentDetails,
                                time: e.target.value,
                            })
                        }
                    />
                    <label className="block mb-2">Doctor:</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded mb-4"
                        value={newAppointmentDetails.doctor}
                        onChange={(e) =>
                            setNewAppointmentDetails({
                                ...newAppointmentDetails,
                                doctor: e.target.value,
                            })
                        }
                    />
                    <label className="block mb-2">Hospital:</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded mb-4"
                        value={newAppointmentDetails.hospital}
                        onChange={(e) =>
                            setNewAppointmentDetails({
                                ...newAppointmentDetails,
                                hospital: e.target.value,
                            })
                        }
                    />
                    <button
                        onClick={handleCreateAppointmentSubmit}
                        className="w-full bg-blue-500 text-white p-2 rounded-lg"
                    >
                        Submit Appointment
                    </button>
                </div>
            </Modal>
        </section>
    );
};

export default PatientAppointments;
