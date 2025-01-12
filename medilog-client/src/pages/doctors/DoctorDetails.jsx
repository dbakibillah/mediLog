import { useState, useEffect } from "react";

const DoctorDetails = ({ doctorCode }) => {
    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        fetch(`/doctors.json`)
            .then((response) => response.json())
            .then((data) => {
              setDoctor(data)
            })
            .catch((error) => console.error("Error fetching the data:", error));
    }, [doctorCode]);

    if (!doctor) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-6 p-2 md:px-24 lg:px-36 py-12">
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
                <div className="w-1/4">
                    <img
                        src={doctor.imageUrl} // Assuming you have an image URL
                        alt={doctor.name}
                        className="w-full rounded-lg"
                    />
                </div>
                <div className="w-3/4 pl-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{doctor.name}</h2>
                    <p className="text-gray-600 mb-2">{doctor.medicalDegree}</p>
                    <p className="text-gray-600 mb-2">Specialist in {doctor.specialist}</p>
                    <div className="flex items-center mb-2">
                        <p className="text-gray-600">Total Experience: {doctor.totalExperience}</p>
                        <span className="mx-4">|</span>
                        <p className="text-gray-600">BMDC Number: {doctor.bmdcNumber}</p>
                    </div>
                    <p className="text-gray-600 mb-4">Working in: {doctor.workingIn}</p>
                    <div className="flex items-center">
                        <p className="text-gray-600 font-bold text-lg">Rating: {doctor.rating}</p>
                        <span className="ml-4 text-blue-500">({doctor.reviewsCount} reviews)</span>
                    </div>
                </div>
                <div className="w-1/4 text-right">
                    <p className="text-lg text-gray-600">Consultation Fee:</p>
                    <p className="text-2xl font-bold text-blue-500">৳{doctor.consultationFee}</p>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-green-700">
                        See Doctor Now
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">About Doctor</h3>
                <p className="text-gray-600">{doctor.aboutDoctor}</p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">At a Glance</h3>
                    <p className="text-gray-600">Instant Consultation Time: {doctor.instantConsultationTime}</p>
                    <p className="text-gray-600">Appointment Consultation Time: {doctor.appointmentConsultationTime}</p>
                    <p className="text-gray-600">Follow-up Fee: ৳{doctor.followUpFee}</p>
                    <p className="text-gray-600">Patients Attended: {doctor.patientAttended}</p>
                    <p className="text-gray-600">Joined Date: {doctor.joinedDate}</p>
                    <p className="text-gray-600">Avg Consultation Time: {doctor.avgConsultationTime}</p>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Experience</h3>
                    <p className="text-gray-600">{doctor.experience}</p>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetails;
