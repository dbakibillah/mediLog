import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactRating from 'react-rating';
import { useState, useMemo } from 'react';
import SearchBar from '../../components/searchBar/SearchBar';

const Consultation = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const itemsPerPage = 8;

    const { data: doctorsData = {}, isLoading, isError } = useQuery(
        ['doctors', currentPage], // No need to pass searchQuery here, it will be handled client-side
        async () => {
            const response = await axios.get('http://localhost:8081/doctors', {
                params: {
                    _page: currentPage,
                    _limit: itemsPerPage,
                },
            });

            console.log("API response:", response.data);
            return response.data;
        },
        {
            keepPreviousData: true, // Keep previous data while fetching new data
        }
    );

    const doctors = Array.isArray(doctorsData.doctors) ? doctorsData.doctors : [];
    const totalDoctors = doctorsData.total || 0;
    const totalPages = Math.ceil(totalDoctors / itemsPerPage);

    const filteredDoctors = useMemo(() => {
        return doctors.filter((doctor) => {
            const name = doctor.name || "";
            const email = doctor.email || "";
            const specialty = doctor.specialist || "";

            return (
                name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                specialty.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    }, [doctors, searchQuery]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query); // Update search query when user types
        setCurrentPage(1); // Reset to the first page when a new search is made
    };

    if (isLoading) {
        return (
            <div className="text-center text-lg font-medium text-gray-400 py-10">
                <p>Loading doctors...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center text-lg font-medium text-red-500 py-10">
                <p>Failed to load doctors. Please try again later.</p>
            </div>
        );
    }

    // Pagination logic for filtered doctors
    const indexOfLastDoctor = currentPage * itemsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - itemsPerPage;
    const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

    return (
        <section className="container mx-auto lg:px-24 min-h-screen py-12">
            <h1 className="text-5xl font-extrabold text-center text-blue-800 mb-4">Consult a Doctor</h1>

            {/* Search Bar */}
            <div className="mb-8 flex justify-end">
                <SearchBar onSearch={handleSearch} searchQuery="Search by name, email, or specialty..." />
            </div>

            {/* Doctor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentDoctors.map((doctor) => (
                    <div
                        key={doctor.id}
                        className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform p-5 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg"
                    >
                        <figure className="overflow-hidden">
                            <img
                                src={doctor.imgUrl}
                                alt={doctor.name}
                                className="w-full h-64 object-cover mb-2 rounded-lg"
                            />
                        </figure>
                        <div className="">
                            <h2 className="text-2xl font-bold text-blue-600 mb-2">{doctor.name}</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-1">
                                <strong>Specialty:</strong> {doctor.specialist}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 mb-1">
                                <strong>Experience:</strong> {doctor.totalExperience} years
                            </p>
                            <div className="flex items-center mb-4">
                                <ReactRating
                                    initialRating={doctor.rating}
                                    readonly
                                    fullSymbol={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>}
                                    emptySymbol={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-300"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>}
                                    className="mr-2"
                                />
                            </div>

                            <Link to={`/doctors/${doctor.id}`}>
                                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:bg-gradient-to-l transition-all ease-in-out duration-300">
                                    View Doctor
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-8 space-x-3">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-5 py-3 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Prev
                </button>

                {Array.from({ length: Math.ceil(filteredDoctors.length / itemsPerPage) }, (_, index) => (
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
                    disabled={currentPage === Math.ceil(filteredDoctors.length / itemsPerPage)}
                    className="px-5 py-3 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </section>
    );
};

export default Consultation;
