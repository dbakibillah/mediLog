import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

const OurServices = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        fetch("/ourServices.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch services data");
                }
                return response.json();
            })
            .then((data) => setServices(data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <section className="container mx-auto px-6 lg:px-24 py-12">
            <h2 className="text-3xl lg:text-5xl font-bold text-blue-600 text-center mb-8">
                Our Services
            </h2>
            <Marquee gradient={false} speed={25} pauseOnHover={true}>
                <div className="flex">
                    {services.map((service) => (
                        <div
                            key={service._id}
                            className="bg-white dark:bg-gray-800 mx-2 rounded-lg p-5 w-1/3 cursor-pointer hover:shadow-xl transition duration-300 dark:hover:shadow-gray-700"
                        >
                            <img
                                src={service.img}
                                alt={service.title}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                {service.name}
                            </h3>
                            <p className="text-gray-500">{service.shortDescription}</p>
                        </div>
                    ))}
                </div>
            </Marquee>
        </section>
    );
};

export default OurServices;
