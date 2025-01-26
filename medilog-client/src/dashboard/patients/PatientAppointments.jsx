import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProviders";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

const PatientAppointments = () => {
    const { user } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [formData, setFormData] = useState({
        consultationDate: "",
        consultationTime: "",
        disease: "",
        additionalNotes: "",
        doctorId: "",
        doctorEmail: "",
        doctorName: "",
        hospitalName: "",
    });

    // Fetch appointments
    const { data: appointments, isLoading, isError } = useQuery({
        queryKey: ['appointments', user.email],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:8081/users-appointments`, {
                params: { email: user.email },
            });
            return res.data;
        }
    });

    // Fetch doctors list
    const { data: doctors, refetch } = useQuery({
        queryKey: ['doctors'],
        queryFn: async () => {
            const res = await axios.get("http://localhost:8081/all-doctors");
            return res.data;
        }
    });

    if (isLoading) {
        return <div className="text-center text-xl text-gray-600">Loading your appointments...</div>;
    }

    if (isError || !appointments) {
        return <div className="text-center text-xl text-red-500">Error fetching your appointments</div>;
    }

    // Get today's date
    const today = new Date();

    // Separate upcoming and past appointments
    const upcomingAppointments = appointments.filter(appointment => new Date(appointment.consultation_date) > today);
    const pastAppointments = appointments.filter(appointment => new Date(appointment.consultation_date) <= today);

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Format the date and time (similar to your provided format)
    const formatDateAndTime = (dateStr) => {
        const dateObject = new Date(dateStr);

        // Format the date
        const formattedDate = dateObject.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        // Format the time
        const formattedTime = dateObject.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        return { formattedDate, formattedTime };
    };

    // Handle form submission to book appointment
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure required fields are filled
        if (!formData.doctorId || !formData.consultationDate || !formData.consultationTime || !formData.disease) {
            Swal.fire({
                title: "Error!",
                text: "Please fill in all the required fields.",
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
            });
            return;
        }

        // Prepare appointment data
        const appointmentData = {
            patientName: user.displayName,
            patientEmail: user.email,
            doctorId: formData.doctorId,
            doctorEmail: formData.doctorEmail,
            doctorName: formData.doctorName,
            hospitalName: formData.hospitalName,
            consultationDate: formData.consultationDate,
            consultationTime: formData.consultationTime,
            disease: formData.disease,
            additionalNotes: formData.additionalNotes,
            status: "pending",
        };

        try {
            // Send the data to the backend API
            const response = await axios.post("http://localhost:8081/appointments", appointmentData);
            refetch();
            if (response.status === 201) {
                Swal.fire({
                    title: "Success!",
                    text: "Your appointment has been booked successfully!",
                    icon: "success",
                    timer: 3000,
                    showConfirmButton: false,
                });
                setIsModalOpen(false); // Close modal after booking
                setFormData({
                    consultationDate: "",
                    consultationTime: "",
                    disease: "",
                    additionalNotes: "",
                    doctorId: "",
                    doctorEmail: "",
                    doctorName: "",
                    hospitalName: "",
                });
            }
        } catch (error) {
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
        <section className="container mx-auto lg:px-24 py-8">
            <Helmet>
                <title>Your Appointments | MediLog</title>
            </Helmet>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Your Appointments</h1>

            {/* Book Appointment Button */}
            <div className="mb-6 text-center">
                <button
                    onClick={() => setIsModalOpen(true)} // Open modal on button click
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    Book an Appointment
                </button>
            </div>

            {/* Upcoming and Past Appointments Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Appointments */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Appointments</h2>
                    {upcomingAppointments.length > 0 ? (
                        upcomingAppointments.map((appointment) => {
                            const { formattedDate } = formatDateAndTime(appointment.consultation_date);
                            const { formattedTime } = formatDateAndTime(appointment.consultation_time);
                            return (
                                <div
                                    key={appointment.id}
                                    className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-6 mb-6"
                                >
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-700">{appointment.doctor_name}</h3>
                                        <p className="text-gray-600">{appointment.hospital_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">
                                            <strong>Consultation Date: </strong>{formattedDate}
                                            <br />
                                            <strong>Consultation Time: </strong>{formattedTime}
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Disease: </strong>{appointment.disease}
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Additional Notes: </strong>{appointment.additional_notes || "N/A"}
                                        </p>
                                        <div
                                            className={`mt-4 text-sm font-semibold py-1 px-4 rounded-full inline-block ${appointment.status === "pending" ? "bg-yellow-300 text-yellow-800" : appointment.status === "confirmed" ? "bg-green-300 text-green-800" : "bg-gray-300 text-gray-800"}`}
                                        >
                                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-600">No upcoming appointments.</p>
                    )}
                </div>

                {/* Past Appointments */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Past Appointments</h2>
                    {pastAppointments.length > 0 ? (
                        pastAppointments.map((appointment) => {
                            const { formattedDate } = formatDateAndTime(appointment.consultation_date);
                            const { formattedTime } = formatDateAndTime(appointment.consultation_time);
                            return (
                                <div
                                    key={appointment.id}
                                    className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-6 mb-6"
                                >
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-700">{appointment.doctor_name}</h3>
                                        <p className="text-gray-600">{appointment.hospital_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">
                                            <strong>Consultation Date: </strong>{formattedDate}
                                            <br />
                                            <strong>Consultation Time: </strong>{formattedTime}
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Disease: </strong>{appointment.disease}
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Additional Notes: </strong>{appointment.additional_notes || "N/A"}
                                        </p>
                                        <div
                                            className={`mt-4 text-sm font-semibold py-1 px-4 rounded-full inline-block ${appointment.status === "pending" ? "bg-yellow-300 text-yellow-800" : appointment.status === "confirmed" ? "bg-green-300 text-green-800" : "bg-gray-300 text-gray-800"}`}
                                        >
                                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-600">No past appointments.</p>
                    )}
                </div>
            </div>

            {/* Modal for booking appointment */}
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} center classNames={{ modal: "rounded-lg shadow-lg" }}>
                <div className="bg-white rounded-lg shadow-lg p-8 w-full mx-auto">
                    <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">Book Consultation</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Select Doctor */}
                        <div>
                            <label className="block text-lg font-semibold text-gray-700 mb-2">Select Doctor:</label>
                            <select
                                name="doctorId"
                                onChange={(e) => {
                                    const selectedDoctor = doctors.find(doc => doc.id === Number(e.target.value));
                                    setFormData({
                                        ...formData,
                                        doctorId: selectedDoctor.id,
                                        doctorName: selectedDoctor.name,
                                        doctorEmail: selectedDoctor.email,
                                        hospitalName: selectedDoctor.workingIn,
                                    });
                                }}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                required
                            >
                                <option value="">Select a Doctor</option>
                                {doctors?.map((doctor) => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {doctor.name} - {doctor.specialist}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Consultation Date */}
                        <div>
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

                        {/* Consultation Time */}
                        <div>
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

                        {/* Disease */}
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

                        {/* Additional Notes */}
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

export default PatientAppointments;
