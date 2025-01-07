import 'animate.css';

const Banner = () => {
    return (
        <section className="container mx-auto px-6 p-2 md:px-24 lg:px-36 flex flex-col md:flex-row items-center gap-8 overflow-hidden">
            {/* Text Content */}
            <div className="text-center md:text-left flex-1 flex flex-col justify-center items-center md:items-start space-y-8 animate__animated animate__fadeInLeft animate__slower">
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-blue-600">
                    Medilog
                </h2>
                <h5 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-700 mt-4">
                    Connecting Care, Simplifying Health
                </h5>
                <button className="btn bg-blue-600 text-white text-lg font-medium rounded-lg shadow hover:bg-blue-700 transition-all animate__animated animate__pulse animate__infinite animate__slow">
                    View More
                </button>
            </div>
            {/* Image Content */}
            <figure className="flex-1  animate__animated animate__fadeInRight animate__slower">
                <img
                    src="https://i.ibb.co/c3nb3gC/banner-img.png"
                    alt="Healthcare Banner"
                    className="w-full h-auto object-cover"
                />
            </figure>
        </section>
    );
};

export default Banner;
