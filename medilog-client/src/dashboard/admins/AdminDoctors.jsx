import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import axios from "axios";

const AdminDoctors = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { data: doctors = [], isLoading, isError, error, refetch } = useQuery({
        queryKey: ["doctors"],
        queryFn: async () => {
            const response = await axios.get("http://localhost:8081/admin-doctors");
            return response.data;
        },
        onError: (err) => {
            Swal.fire("Error", "Failed to load doctors data.", "error");
            console.error("Error fetching doctors:", err);
        },
        refetchOnWindowFocus: true,
    });

    const filteredDoctors = doctors.filter((doctor) => {
        const name = doctor.name || "";
        const email = doctor.email || "";
        const specialty = doctor.specialist || "";

        return (
            name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            specialty.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleDeleteDoctor = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action will delete the doctor record permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it",
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8081/admin-doctors/${id}`);
                Swal.fire("Deleted!", "The doctor record has been deleted.", "success");
                refetch();
            } catch (err) {
                console.error("Error deleting doctor:", err);
                Swal.fire("Error", "Failed to delete doctor. Please try again.", "error");
            }
        }
    };

    if (isLoading) {
        return <p className="text-center text-lg font-medium text-gray-400">Loading doctors...</p>;
    }

    if (isError) {
        return <p className="text-center text-lg font-medium text-red-500">{error.message}</p>;
    }

    return (
        <section className="container mx-auto px-4 py-10">
            <h2 className="text-4xl font-bold text-center mb-6 text-blue-600">Manage Doctors</h2>
            <div className="flex justify-end mb-6">
                <input
                    type="text"
                    placeholder="Search by name, email, or specialty"
                    className="input input-bordered w-full max-w-sm"
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="table w-full border-collapse border border-gray-200 rounded-lg shadow-lg">
                    <thead className="bg-gray-200 text-gray-800">
                        <tr>
                            <th className="px-4 py-2 border">ID</th>
                            <th className="px-4 py-2 border">Name</th>
                            <th className="px-4 py-2 border">Email</th>
                            <th className="px-4 py-2 border">Specialty</th>
                            <th className="px-4 py-2 border">Experience</th>
                            <th className="px-4 py-2 border">Fee</th>
                            <th className="px-4 py-2 border">Rating</th>
                            <th className="px-4 py-2 border">Hospital</th>
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedDoctors.map((doctor) => (
                            <tr
                                key={doctor.id}
                                className="hover:bg-gray-100 transition-colors"
                            >
                                <td className="px-4 py-2 border">{doctor.id}</td>
                                <td className="px-4 py-2 border">{doctor.name}</td>
                                <td className="px-4 py-2 border">{doctor.email}</td>
                                <td className="px-4 py-2 border">{doctor.specialist}</td>
                                <td className="px-4 py-2 border">{doctor.totalExperience}</td>
                                <td className="px-4 py-2 border">${doctor.consultationFee}</td>
                                <td className="px-4 py-2 border">{doctor.rating} / 5</td>
                                <td className="px-4 py-2 border">{doctor.workingIn}</td>
                                <td className="px-4 py-2 border">
                                    <button
                                        onClick={() => handleDeleteDoctor(doctor.id)}
                                        className="btn btn-sm bg-red-500 text-white border-none"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-300 text-gray-800"
                            }`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default AdminDoctors;
