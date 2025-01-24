import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProviders";
import axios from "axios";
import SearchBar from "../../components/searchBar/SearchBar";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import Calendar from "react-calendar"; // Calendar component for upcoming appointments
import "react-calendar/dist/Calendar.css"; // Calendar styles
import { Line } from "react-chartjs-2"; // Line chart for test records

const PatientAppointments = () => {
    const { user } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [newAppointmentDetails, setNewAppointmentDetails] = useState({
        date: "",
        time: "",
        doctor: "",
        hospital: "",
        patientName: "",
    });

    // Fetch appointments
    const { data: appointments = [], isLoading, isError } = useQuery({
        queryKey: ["appointments", user.email],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:8081/appointments?email=${user.email}`);
            return response.data;
        },
    });

    // Search handler
    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    // Filter appointments based on search query and selected date
    const filteredAppointments = appointments.filter((appointment) => {
        const matchesSearch =
            appointment.doctor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appointment.hospital_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appointment.disease.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDate =
            new Date(appointment.consultation_date).toDateString() === selectedDate.toDateString();
        return matchesSearch && matchesDate;
    });

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
            await axios.post("http://localhost:8081/appointments", newAppointmentDetails);
            handleCreateAppointmentModalClose();
        } catch (error) {
            console.error("Error creating appointment", error);
        }
    };

    // Chart data for medical test visualization
    const testGraphData = {
        labels: ["January", "February", "March", "April", "May"],
        datasets: [
            {
                label: "Blood Sugar Level",
                data: [95, 110, 105, 100, 90],
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgba(255, 99, 132, 0.2)",
            },
            {
                label: "Cholesterol Level",
                data: [180, 200, 190, 170, 160],
                backgroundColor: "rgb(54, 162, 235)",
                borderColor: "rgba(54, 162, 235, 0.2)",
            },
        ],
    };

    if (isLoading) {
        return <div className="text-center text-lg text-blue-500">Loading your appointments...</div>;
    }

    if (isError) {
        return <div className="text-center text-lg text-red-500">Error loading appointments. Please try again later.</div>;
    }

    return (
        <section className="container mx-auto lg:px-24 p-6">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Your Appointments</h1>

            <div className="flex justify-between mb-6">
                <SearchBar onSearch={handleSearch} searchQuery="Search by doctor, hospital, or disease..." />
                <button
                    onClick={handleCreateAppointmentModalOpen}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Create New Appointment
                </button>
            </div>

            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="mb-6 rounded-lg shadow-lg"
            />

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
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map((appointment) => (
                                <tr key={appointment.id} className="hover:bg-gray-100">
                                    <td className="py-3 px-4">{new Date(appointment.consultation_date).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">{appointment.consultation_time}</td>
                                    <td className="py-3 px-4">{appointment.doctor_name}</td>
                                    <td className="py-3 px-4">{appointment.disease}</td>
                                    <td className="py-3 px-4">{appointment.hospital_name}</td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`py-1 px-3 rounded-lg text-white ${
                                                appointment.status === "pending"
                                                    ? "bg-yellow-500"
                                                    : appointment.status === "completed"
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        >
                                            {appointment.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => handleViewDetails(appointment)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <h2 className="text-2xl font-semibold text-gray-800 mt-10">Medical Tests</h2>
            <div className="bg-white p-6 mt-4 shadow-lg rounded-lg">
                <Line data={testGraphData} />
            </div>

            {selectedAppointment && (
                <Modal open={openModal} onClose={closeModal} center>
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-4">Appointment Details</h2>
                        <p><strong>Patient Name:</strong> {selectedAppointment.patient_name}</p>
                        <p><strong>Doctor:</strong> {selectedAppointment.doctor_name}</p>
                        <p><strong>Hospital:</strong> {selectedAppointment.hospital_name}</p>
                        <p><strong>Consultation Date:</strong> {new Date(selectedAppointment.consultation_date).toLocaleDateString()}</p>
                        <p><strong>Consultation Time:</strong> {selectedAppointment.consultation_time}</p>
                        <p><strong>Symptoms:</strong> {selectedAppointment.disease}</p>
                        <p><strong>Status:</strong> {selectedAppointment.status}</p>
                    </div>
                </Modal>
            )}

            <Modal open={createModalOpen} onClose={handleCreateAppointmentModalClose} center>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Create Appointment</h2>
                    <label className="block mb-2">Patient Name:</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded mb-4"
                        value={newAppointmentDetails.patientName}
                        onChange={(e) =>
                            setNewAppointmentDetails({ ...newAppointmentDetails, patientName: e.target.value })
                        }
                    />
                    <button
                        onClick={handleCreateAppointmentSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                        Submit
                    </button>
                </div>
            </Modal>
        </section>
    );
};

export default PatientAppointments;
