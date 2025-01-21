import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProviders";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import Swal from "sweetalert2";

const DoctorDetails = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        consultationDate: "",
        consultationTime: "",
        disease: "",
        additionalNotes: "",
    });

    const { data: doctor, isLoading, isError } = useQuery({
        queryKey: ["doctors", id],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:8081/doctors/${id}`);
            return response.data;
        },
    });

    if (isLoading) {
        return (
            <section className="container mx-auto lg:px-24 p-10 text-center min-h-screen">
                <p className="text-lg font-semibold text-gray-500">Loading doctor details...</p>
            </section>
        );
    }

    if (isError || !doctor) {
        return (
            <section className="container mx-auto lg:px-24 p-10 text-center min-h-screen">
                <p className="text-lg font-semibold text-red-500">Failed to load doctor details. Please try again later.</p>
            </section>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare the data to send to the backend
        const appointmentData = {
            patientName: user.displayName,
            patientEmail: user.email,
            doctorId: doctor.id,
            doctorName: doctor.name,
            hospitalName: doctor.workingIn,
            consultationDate: formData.consultationDate,
            consultationTime: formData.consultationTime,
            disease: formData.disease,
            additionalNotes: formData.additionalNotes,
            status: "pending",
        };

        try {
            // Send the data to the backend API
            const response = await axios.post("http://localhost:8081/appointments", appointmentData);

            // Handle the response (success)
            if (response.status === 201) {
                Swal.fire({
                    title: "Success!",
                    text: "Your appointment has been booked successfully!",
                    icon: "success",
                    timer: 3000,
                    showConfirmButton: false,
                });
                setIsModalOpen(false); // Close the modal
                setFormData({
                    consultationDate: "",
                    consultationTime: "",
                    disease: "",
                    additionalNotes: "",
                });
            }
        } catch (error) {
            // Handle the error (failed request)
            console.error("Error booking appointment:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to book your appointment. Please try again later.",
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
            });
        }
    };

    return (
        <section className="container mx-auto lg:px-24 p-10 min-h-screen">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 shadow-2xl rounded-lg p-8 flex flex-col lg:flex-row items-center gap-10">
                {/* Doctor Image */}
                <div className="flex-1 max-w-xs border-4 border-white rounded-full overflow-hidden shadow-lg hover:scale-105 transform transition-all">
                    <img src={doctor.imgUrl} alt={doctor.name} className="w-full h-full object-cover" />
                </div>

                {/* Doctor Details */}
                <div className="flex-1 space-y-6">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-blue-800">{doctor.name}</h2>
                    <p className="text-lg text-gray-700">{doctor.medicalDegree}</p>
                    <p className="text-md text-gray-600">
                        <strong>Specialty:</strong> {doctor.specialist}
                    </p>
                    <p className="text-md text-gray-600">
                        <strong>Experience:</strong> {doctor.totalExperience}
                    </p>
                    <p className="text-md text-gray-600">
                        <strong>Working At:</strong> {doctor.workingIn}
                    </p>
                    <p className="text-md text-gray-600">
                        <strong>Rating:</strong> {doctor.rating} / 5
                    </p>
                    <p className="text-md text-gray-600">
                        <strong>Consultation Fee:</strong> ${doctor.consultationFee}
                    </p>

                    {/* About Doctor */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-blue-600">About Dr. {doctor.name}</h3>
                        <p className="text-gray-700">{doctor.aboutDoctor}</p>
                    </div>

                    {/* Appointment Details */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-blue-600">Consultation Details</h3>
                        <p className="text-md text-gray-600">
                            <strong>Instant Consultation Time:</strong> {doctor.instantConsultationTime}
                        </p>
                        <p className="text-md text-gray-600">
                            <strong>Appointment Consultation Time:</strong> {doctor.appointmentConsultationTime}
                        </p>
                        <p className="text-md text-gray-600">
                            <strong>Follow-Up Fee:</strong> ${doctor.followUpFee}
                        </p>
                        <p className="text-md text-gray-600">
                            <strong>Average Consultation Time:</strong> {doctor.avgConsultationTime}
                        </p>
                    </div>

                    {/* Contact & Book Consultation */}
                    <div className="mt-6 flex gap-4">
                        <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:bg-gradient-to-l transition-all ease-in-out duration-300">
                            Book Consultation
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} center classNames={{ modal: "rounded-lg shadow-lg" }}>
                <div className="bg-white rounded-lg shadow-lg p-8 w-full mx-auto">
                    <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">Book Consultation</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-lg font-semibold text-gray-700 mb-2">Username:</label>
                            <input
                                type="text"
                                value={user.displayName}
                                readOnly
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-lg font-semibold text-gray-700 mb-2">Doctor Name:</label>
                                <input
                                    type="text"
                                    value={doctor.name}
                                    readOnly
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block text-lg font-semibold text-gray-700 mb-2">Doctor ID:</label>
                                <input
                                    type="text"
                                    value={doctor.id}
                                    readOnly
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-lg font-semibold text-gray-700 mb-2">Consultation Date:</label>
                                <input
                                    type="date"
                                    name="consultationDate"
                                    value={formData.consultationDate}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    required
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block text-lg font-semibold text-gray-700 mb-2">Consultation Time:</label>
                                <input
                                    type="time"
                                    name="consultationTime"
                                    value={formData.consultationTime}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-lg font-semibold text-gray-700 mb-2">Hospital Name:</label>
                            <input
                                type="text"
                                name="hospitalName"
                                readOnly
                                value={doctor.workingIn}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-lg font-semibold text-gray-700 mb-2">Disease:</label>
                            <input
                                type="text"
                                name="disease"
                                value={formData.disease}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-lg font-semibold text-gray-700 mb-2">Additional Notes:</label>
                            <textarea
                                name="additionalNotes"
                                value={formData.additionalNotes}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                rows="3"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:bg-gradient-to-l transition-all ease-in-out duration-300 w-full"
                        >
                            Confirm Booking
                        </button>
                    </form>
                </div>
            </Modal>
        </section>
    );
};

export default DoctorDetails;
