import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import Calendar from "react-calendar"; // Calendar component for upcoming appointments
import "react-calendar/dist/Calendar.css"; // Calendar styles
import Chart from "chart.js/auto"; // For graphical representation of medical tests
import { Line } from "react-chartjs-2"; // Line chart for test records

const PatientDashboard = () => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // Fetch appointments from the database
    const { data: appointments = [], isLoading: loadingAppointments, isError: errorAppointments } = useQuery({
        queryKey: ["patientAppointments"],
        queryFn: async () => {
            const response = await axios.get("http://localhost:8081/appointments");
            return response.data;
        },
    });

    // Fetch medical test records from the database
    const { data: medicalTests = [], isLoading: loadingTests, isError: errorTests } = useQuery({
        queryKey: ["medicalTests"],
        queryFn: async () => {
            const response = await axios.get("http://localhost:8081/medicaltests");
            return response.data;
        },
    });

    const handleViewDetails = (appointment) => {
        setSelectedAppointment(appointment);
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
        setSelectedAppointment(null);
    };

    if (loadingAppointments || loadingTests) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    if (errorAppointments || errorTests) {
        return (
            <p className="text-center text-red-500">
                Failed to load data. Please try again later.
            </p>
        );
    }

    return (
        <section className="p-6 bg-gray-100 min-h-screen">
            <div className="container mx-auto lg:px-24">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Patient Dashboard</h1>

                {/* Overview Section */}
                <div className="bg-white p-6 shadow-md rounded-lg mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Medical Condition Overview */}
                        <div className="p-4 bg-gray-50 shadow rounded">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Profile Picture</h3>
                            <div className="flex justify-center items-center h-32 w-32 bg-gray-200 rounded-full overflow-hidden">
                                <img
                                    src="https://via.placeholder.com/150" 
                                    alt="Profile" 
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 shadow rounded">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Last Medical Condition</h3>
                            {medicalTests.length > 0 ? (
                                <ul className="text-gray-600">
                                    <li><strong>Sugar Level:</strong> {medicalTests[0].sugar_level} mg/dL</li>
                                    <li><strong>pH Level:</strong> {medicalTests[0].ph_level}</li>
                                    <li><strong>Cholesterol:</strong> {medicalTests[0].cholesterol_level} mg/dL</li>
                                    <li><strong>Last Update:</strong> {new Date(medicalTests[0].updated_at).toLocaleDateString()}</li>
                                </ul>
                            ) : (
                                <p className="text-gray-500">No recent medical condition data available.</p>
                            )}
                        </div>

                        {/* Last Checkup Overview */}
                        <div className="p-4 bg-gray-50 shadow rounded">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Last Checkup</h3>
                            {appointments.length > 0 ? (
                                <p className="text-gray-600">
                                    <strong>Date:</strong> {new Date(appointments[0].consultation_date).toLocaleDateString()}<br />
                                    <strong>Doctor:</strong> {appointments[0].doctor_name}<br />
                                    <strong>Hospital:</strong> {appointments[0].hospital_name}
                                </p>
                            ) : (
                                <p className="text-gray-500">No recent checkup data available.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Calendar Section */}
                <div className="bg-white p-6 shadow-md rounded-lg mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Health Calendar</h2>
                    <Calendar
                        tileContent={({ date }) => {
                            const formattedDate = date.toISOString().split('T')[0];
                            const checkupDates = appointments.map(appt => appt.consultation_date);
                            const testDates = medicalTests.map(test => test.updated_at);

                            if (checkupDates.includes(formattedDate)) {
                                return <p className="text-xs text-blue-500">Checkup</p>;
                            }
                            if (testDates.includes(formattedDate)) {
                                return <p className="text-xs text-green-500">Test</p>;
                            }
                            return null;
                        }}
                    />
                </div>

                {/* Detailed Sections */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed View</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Medical Tests Graph */}
                    <div className="bg-white p-6 shadow-md rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical Test Trends</h3>
                        <Line
                            data={{
                                labels: medicalTests.map(test => new Date(test.updated_at).toLocaleDateString()),
                                datasets: [
                                    {
                                        label: "Sugar Level",
                                        data: medicalTests.map(test => test.sugar_level),
                                        fill: false,
                                        borderColor: "rgb(255, 99, 132)",
                                        tension: 0.1,
                                    },
                                    {
                                        label: "pH Level",
                                        data: medicalTests.map(test => test.ph_level),
                                        fill: false,
                                        borderColor: "rgb(54, 162, 235)",
                                        tension: 0.1,
                                    },
                                    {
                                        label: "Cholesterol Level",
                                        data: medicalTests.map(test => test.cholesterol_level),
                                        fill: false,
                                        borderColor: "rgb(75, 192, 192)",
                                        tension: 0.1,
                                    },
                                ],
                            }}
                        />
                    </div>
                </div>

                {/* Appointment Details Modal */}
                {selectedAppointment && (
                    <Modal open={openModal} onClose={closeModal} center>
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">Appointment Details</h2>
                            <p><strong>Patient Name:</strong> {selectedAppointment.patient_name}</p>
                            <p><strong>Doctor:</strong> {selectedAppointment.doctor_name}</p>
                            <p><strong>Hospital:</strong> {selectedAppointment.hospital_name}</p>
                            <p>
                                <strong>Consultation Date:</strong> {new Date(selectedAppointment.consultation_date).toLocaleDateString()}
                            </p>
                            <p><strong>Consultation Time:</strong> {selectedAppointment.consultation_time}</p>
                            <p><strong>Status:</strong> {selectedAppointment.status}</p>
                            <p><strong>Notes:</strong> {selectedAppointment.additional_notes}</p>
                        </div>
                    </Modal>
                )}
            </div>
        </section>
    );
};

export default PatientDashboard;
