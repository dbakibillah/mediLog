import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DoctorDetails = () => {
    const { id } = useParams(); // Get dynamic ID from the route
    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        // Fetch doctor data based on the dynamic ID
        axios
            .get(`http://localhost:8081/doctors/${id}`) // Replace with your API's base URL
            .then((response) => {
                setDoctor(response.data);
            })
            .catch((error) => console.error("Error fetching doctor details:", error));
    }, [id]);

    if (!doctor) {
        return (
            <section className="container mx-auto lg:px-24 p-2 text-center min-h-screen">
                <p className="text-lg font-semibold text-gray-500">Loading doctor details...</p>
            </section>
        );
    }

    return (
        <section className="container mx-auto lg:px-24 p-2 min-h-screen">
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col lg:flex-row items-center gap-6">
                {/* Doctor Image */}
                <div className="flex-1 border ">
                    <figure className="w-2/5 mx-auto">
                        <img src={doctor.imgURL} alt="" />
                    </figure>
                </div>

                {/* Doctor Details */}
                <div className="flex-1 space-y-4">
                    <h2 className="text-2xl lg:text-4xl font-bold text-blue-600">{doctor.name}</h2>
                    <p className="text-lg">{doctor.medicalDegree}</p>
                </div>
            </div>
        </section>
    );
};

export default DoctorDetails;
