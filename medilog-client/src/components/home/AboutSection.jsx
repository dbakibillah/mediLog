const AboutSection = () => {
    return (
        <section className="container mx-auto px-6 lg:px-24 py-12 flex flex-col lg:flex-row items-center gap-12">
            {/* Image Section */}
            <figure className="flex-1 animate__animated animate__fadeInLeft lg:p-5">
                <img
                    src="https://i.ibb.co/fr0KyzM/about-sect.jpg"
                    alt="Doctors Illustration"
                    className="w-full h-auto object-cover rounded-lg"
                />
            </figure>

            {/* Text Section */}
            <div className="flex-1 text-center lg:text-left space-y-6 animate__animated animate__fadeInRight">
                <h2 className="text-3xl lg:text-5xl font-bold text-blue-600">
                    Who Are We?
                </h2>
                <p className="text-lg leading-relaxed text-gray-700">
                    Welcome to <span className="font-semibold">MediLog!</span> We are dedicated to improving healthcare
                    accessibility and making medical records easier to manage. Our mission is to provide patients, doctors, and administrators
                    with the tools they need to streamline appointments, connect seamlessly, and ensure better care.
                </p>
                <p className="text-lg leading-relaxed text-gray-700">
                    With MediLog, you can track your medical history, find trusted doctors and hospitals, and even order medicines from the comfort
                    of your home. Our vision is a healthier, more connected world.
                </p>
                <button className="px-6 py-3 bg-blue-600 text-white font-medium text-lg rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300">
                    Learn More
                </button>
            </div>
        </section>
    );
};

export default AboutSection;
