import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactRating from 'react-rating';

const Services = () => {
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/services.json'); // Adjust path if needed
        const data = await response.json();
        setServices(data.packages);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load services:", error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Pagination logic
  const totalServices = services.length;
  const totalPages = Math.ceil(totalServices / itemsPerPage);
  const servicesToDisplay = services.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center text-lg font-medium text-gray-400 py-10">
        <p>Loading services...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="text-center text-lg font-medium text-red-500 py-10">
        <p>Failed to load services. Please try again later.</p>
      </div>
    );
  }

  return (
    <section className="container mx-auto lg:px-24 min-h-screen py-12">
      <h1 className="text-5xl font-extrabold text-center text-blue-800 mb-12">Our Health Check Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {servicesToDisplay.map((service) => (
          <div
            key={service.name}
            className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform p-5 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg"
          >
            <figure className="overflow-hidden">
              <img
                src={service.imgUrl}
                alt={service.name}
                className="w-full h-64 object-cover mb-2 rounded-lg"
              />
            </figure>
            <div>
              <h2 className="text-2xl font-bold text-blue-600 mb-2">{service.name}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-1">
                <strong>Description:</strong> {service.description}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-1">
                <strong>Price:</strong> ${service.price.toFixed(2)}
              </p>
              <div className="flex items-center mb-4">
                <ReactRating
                  initialRating={service.rating}
                  readonly
                  fullSymbol={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>}
                  emptySymbol={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-300"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>}
                  className="mr-2"
                />
              </div>

              <Link to={`/services/${service.name}`}>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:bg-gradient-to-l transition-all ease-in-out duration-300">
                  View Service
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center mt-8 space-x-3">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-5 py-3 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`px-5 py-3 text-white rounded-lg shadow-md transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed 
              ${currentPage === index + 1
                ? "bg-gradient-to-r from-blue-500 to-blue-600"
                : "bg-gray-300 text-gray-800 hover:bg-indigo-500 hover:text-white"
              }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-5 py-3 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default Services;
