import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";

const DoctorDetails = () => {
    const { id } = useParams();
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
                        {/* <a
                            href={`mailto:${doctor.email}`}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:bg-gradient-to-l transition-all ease-in-out duration-300"
                        >
                            Contact Doctor
                        </a> */}
                        <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:bg-gradient-to-l transition-all ease-in-out duration-300">
                            Book Consultation
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DoctorDetails;
