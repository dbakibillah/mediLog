import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import Calendar from "react-calendar"; // Calendar component for upcoming prescriptions
import "react-calendar/dist/Calendar.css"; // Calendar styles
import Chart from "chart.js/auto"; // For graphical representation of health stats
import { Line } from "react-chartjs-2"; // Line chart for health stats

const PatientPrescriptions = () => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date()); // For calendar date selection
    const [createModalOpen, setCreateModalOpen] = useState(false); // State to manage create prescription modal
    const [newPrescriptionDetails, setNewPrescriptionDetails] = useState({
        medicineName: "",
        dosage: "",
        frequency: "",
        startDate: "",
        endDate: "",
        doctor: "",
    }); // State for new prescription details

    // Fetch prescriptions from the database
    const { data: prescriptions = [], isLoading, isError } = useQuery({
        queryKey: ["patientPrescriptions"],
        queryFn: async () => {
            const response = await axios.get("http://localhost:8081/prescriptions");
            return response.data;
        },
    });

    // Filter prescriptions for the selected date
    const upcomingPrescriptions = prescriptions.filter(
        (prescription) =>
            new Date(prescription.start_date).toDateString() ===
            selectedDate.toDateString()
    );

    // Handle opening and closing the modal
    const handleViewDetails = (prescription) => {
        setSelectedPrescription(prescription);
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
        setSelectedPrescription(null);
    };

    const handleCreatePrescriptionModalOpen = () => {
        setCreateModalOpen(true);
    };

    const handleCreatePrescriptionModalClose = () => {
        setCreateModalOpen(false);
        setNewPrescriptionDetails({
            medicineName: "",
            dosage: "",
            frequency: "",
            startDate: "",
            endDate: "",
            doctor: "",
        });
    };

    const handleCreatePrescriptionSubmit = async () => {
        try {
            // Submit the new prescription data to the server
            await axios.post("http://localhost:8081/prescription", newPrescriptionDetails);
            // Close the modal and reset the form
            handleCreatePrescriptionModalClose();
        } catch (error) {
            console.error("Error creating prescription", error);
        }
    };

    // Data for health stats graph (could be linked to prescriptions or tests)
    const healthStatsGraphData = {
        labels: ["January", "February", "March", "April", "May"], // Example months
        datasets: [
            {
                label: "Blood Pressure",
                data: [120, 125, 118, 110, 115],
                fill: false,
                backgroundColor: "rgb(75, 192, 192)",
                borderColor: "rgba(75, 192, 192, 0.2)",
            },
            {
                label: "Heart Rate",
                data: [72, 75, 78, 80, 70],
                fill: false,
                backgroundColor: "rgb(153, 102, 255)",
                borderColor: "rgba(153, 102, 255, 0.2)",
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
                <h1 className="text-3xl font-bold text-gray-800 mb-6">My Prescriptions</h1>

                {/* Create Prescription Bar */}
                <div
                    onClick={handleCreatePrescriptionModalOpen}
                    className="cursor-pointer bg-blue-500 text-white p-4 rounded-lg text-center"
                >
                    Create New Prescription
                </div>

                {prescriptions.length === 0 ? (
                    <p className="text-center text-gray-500">No prescriptions available.</p>
                ) : (
                    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200 text-gray-700">
                            <tr>
                                <th className="py-3 px-4 text-left">Medicine Name</th>
                                <th className="py-3 px-4 text-left">Dosage</th>
                                <th className="py-3 px-4 text-left">Frequency</th>
                                <th className="py-3 px-4 text-left">Start Date</th>
                                <th className="py-3 px-4 text-left">End Date</th>
                                <th className="py-3 px-4 text-left">Doctor</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prescriptions.map((prescription) => (
                                <tr
                                    key={prescription.id}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="py-3 px-4">{prescription.medicine_name}</td>
                                    <td className="py-3 px-4">{prescription.dosage}</td>
                                    <td className="py-3 px-4">{prescription.frequency}</td>
                                    <td className="py-3 px-4">
                                        {new Date(prescription.start_date).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4">
                                        {new Date(prescription.end_date).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4">{prescription.doctor_name}</td>
                                    <td className="py-3 px-4">
                                        <button
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                            onClick={() => handleViewDetails(prescription)}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-6">Upcoming Prescriptions</h2>
                <div className="flex flex-col lg:flex-row bg-white p-6 shadow-md rounded-lg gap-6">
                    {/* Calendar for selecting date */}
                    <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        className="shadow-md rounded"
                    />

                    {/* Prescriptions on selected date */}
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Prescriptions on {selectedDate.toDateString()}
                        </h3>
                        {upcomingPrescriptions.length > 0 ? (
                            <ul className="list-disc ml-5 text-gray-600">
                                {upcomingPrescriptions.map((prescription) => (
                                    <li key={prescription.id}>
                                        {prescription.medicine_name} prescribed by Dr.{" "}
                                        {prescription.doctor_name} until{" "}
                                        {new Date(prescription.end_date).toLocaleDateString()}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No prescriptions on this date.</p>
                        )}
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-6">Health Stats</h2>
                <div className="bg-white p-6 shadow-md rounded-lg">
                    <Line data={healthStatsGraphData} />
                </div>
            </div>

            {/* Prescription Details Modal */}
            {selectedPrescription && (
                <Modal open={openModal} onClose={closeModal} center>
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-4">Prescription Details</h2>
                        <p><strong>Medicine Name:</strong> {selectedPrescription.medicine_name}</p>
                        <p><strong>Dosage:</strong> {selectedPrescription.dosage}</p>
                        <p><strong>Frequency:</strong> {selectedPrescription.frequency}</p>
                        <p>
                            <strong>Start Date:</strong>{" "}
                            {new Date(selectedPrescription.start_date).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>End Date:</strong>{" "}
                            {new Date(selectedPrescription.end_date).toLocaleDateString()}
                        </p>
                        <p><strong>Doctor:</strong> {selectedPrescription.doctor_name}</p>
                    </div>
                </Modal>
            )}

            {/* Create Prescription Modal */}
            <Modal open={createModalOpen} onClose={handleCreatePrescriptionModalClose} center>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Create Prescription</h2>
                    <label className="block mb-2">Medicine Name:</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded mb-4"
                        value={newPrescriptionDetails.medicineName}
                        onChange={(e) =>
                            setNewPrescriptionDetails({
                                ...newPrescriptionDetails,
                                medicineName: e.target.value,
                            })
                        }
                    />
                    <label className="block mb-2">Dosage:</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded mb-4"
                        value={newPrescriptionDetails.dosage}
                        onChange={(e) =>
                            setNewPrescriptionDetails({
                                ...newPrescriptionDetails,
                                dosage: e.target.value,
                            })
                        }
                    />
                    <label className="block mb-2">Frequency:</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded mb-4"
                        value={newPrescriptionDetails.frequency}
                        onChange={(e) =>
                            setNewPrescriptionDetails({
                                ...newPrescriptionDetails,
                                frequency: e.target.value,
                            })
                        }
                    />
                    <label className="block mb-2">Start Date:</label>
                    <input
                        type="date"
                        className="w-full p-2 border rounded mb-4"
                        value={newPrescriptionDetails.startDate}
                        onChange={(e) =>
                            setNewPrescriptionDetails({
                                ...newPrescriptionDetails,
                                startDate: e.target.value,
                            })
                        }
                    />
                    <label className="block mb-2">End Date:</label>
                    <input
                        type="date"
                        className="w-full p-2 border rounded mb-4"
                        value={newPrescriptionDetails.endDate}
                        onChange={(e) =>
                            setNewPrescriptionDetails({
                                ...newPrescriptionDetails,
                                endDate: e.target.value,
                            })
                        }
                    />
                    <label className="block mb-2">Doctor:</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded mb-4"
                        value={newPrescriptionDetails.doctor}
                        onChange={(e) =>
                            setNewPrescriptionDetails({
                                ...newPrescriptionDetails,
                                doctor: e.target.value,
                            })
                        }
                    />
                    <button
                        onClick={handleCreatePrescriptionSubmit}
                        className="w-full bg-blue-500 text-white p-2 rounded-lg"
                    >
                        Submit Prescription
                    </button>
                </div>
            </Modal>
        </section>
    );
};

export default PatientPrescriptions;
