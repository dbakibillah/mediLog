import { useEffect, useState } from "react";

const OurPartners = () => {
    const [partners, setPartners] = useState([]);

    useEffect(() => {
        fetch("/ourPartners.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch partners data");
                }
                return response.json();
            })
            .then((data) => setPartners(data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <section className="container mx-auto px-6 lg:px-24 py-12">
            {/* Heading */}
            <h2 className="text-3xl lg:text-5xl font-bold text-center mb-12 text-blue-600">
                Our Partners
            </h2>

            {/* Partners Grid */}
            <div className="flex flex-wrap justify-center gap-6">
                {partners.map((partner) => (
                    <figure
                        key={partner._id}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex items-center justify-center w-40 h-40">
                        <img
                            src={partner.img}
                            alt={partner.name}
                            className="w-full h-full object-contain"
                        />
                    </figure>
                ))}
            </div>
        </section>
    );
};

export default OurPartners;
