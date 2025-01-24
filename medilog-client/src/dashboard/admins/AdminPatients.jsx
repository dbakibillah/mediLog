import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import axios from "axios";
import SearchBar from "../../components/searchBar/SearchBar";

const AdminPatients = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [patientsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    const { data: patients = [], isLoading, isError, refetch } = useQuery({
        queryKey: ["patients"],
        queryFn: async () => {
            const response = await axios.get("http://localhost:8081/patients");
            return response.data;
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading patient data. Please try again later.</div>;
    }

    // Calculate age from DOB
    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const ageDiff = new Date() - birthDate;
        const ageDate = new Date(ageDiff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    // Filter patients based on search query
    const filteredPatients = useMemo(
        () =>
            patients.filter(
                (patient) =>
                    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    patient.contact_number.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        [patients, searchQuery]
    );

    // Pagination logic
    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Function to handle "View" button click and show patient details in SweetAlert
    const handleViewPatientDetails = (patient) => {
        Swal.fire({
            title: `${patient.name}'s Details`,
            html: ` 
                <div style="display: flex; flex-direction: column; gap: 5px; font-size: 1.1em; color: #333;">
                    <div style="display: flex; gap: 5px; padding: 8px 0;">
                        <strong>Gender:</strong> <span style="font-weight: 500;">${patient.gender || "N/A"}</span>
                    </div>
                    <div style="display: flex; gap: 5px; padding: 8px 0;">
                        <strong>Date of Birth:</strong> <span style="font-weight: 500;">${patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : "N/A"}</span>
                    </div>
                    <div style="display: flex; gap: 5px; padding: 8px 0;">
                        <strong>Age:</strong> <span style="font-weight: 500;">${patient.date_of_birth ? calculateAge(patient.date_of_birth) : "N/A"}</span>
                    </div>
                    <div style="display: flex; gap: 5px; padding: 8px 0;">
                        <strong>Blood Group:</strong> <span style="font-weight: 500;">${patient.blood_group || "N/A"}</span>
                    </div>
                    <div style="display: flex; gap: 5px; padding: 8px 0;">
                        <strong>Contact:</strong> <span style="font-weight: 500;">${patient.contact_number || "N/A"}</span>
                    </div>
                    <div style="display: flex; gap: 5px; padding: 8px 0;">
                        <strong>Email:</strong> <span style="font-weight: 500;">${patient.email}</span>
                    </div>
                    <div style="display: flex; gap: 5px; padding: 8px 0;">
                        <strong>Address:</strong> <span style="font-weight: 500;">${patient.address || "N/A"}</span>
                    </div>
                    <div style="display: flex; gap: 5px; padding: 8px 0;">
                        <strong>User Type:</strong> <span style="font-weight: 500;">${patient.user_type}</span>
                    </div>
                </div>
            `,
            showCloseButton: true,
            showCancelButton: false,
            confirmButtonText: "Close",
            customClass: {
                popup: 'custom-swal-popup',
                title: 'custom-swal-title',
                htmlContainer: 'custom-swal-html-container'
            },
            didOpen: () => {
                const popup = document.querySelector('.swal2-popup');
                if (popup) {
                    popup.style.maxWidth = '600px';
                    popup.style.padding = '20px';
                    popup.style.borderRadius = '8px';
                    popup.style.backgroundColor = '#f9f9f9';
                }
            }
        });
    };

    // Function to delete patient
    const deletePatient = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/patients/${id}`);
            refetch();
            Swal.fire("Deleted!", "The patient has been deleted.", "success");
        } catch (error) {
            Swal.fire("Error!", "There was an error deleting the patient. Please try again.", "error");
        }
    };

    const handleDeletePatient = (patientId, patientName) => {
        Swal.fire({
            title: `Are you sure you want to delete ${patientName}?`,
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
        }).then((result) => {
            if (result.isConfirmed) {
                deletePatient(patientId);
            }
        });
    };

    return (
        <section className="container mx-auto lg:px-24 p-6">
            <h1 className="text-2xl font-bold mb-4">Patients List</h1>

            {/* Search Bar Component */}
            <div className="mb-4 flex justify-end">
                <SearchBar
                    onSearch={setSearchQuery}
                    searchQuery="Search by name, email, or contact number. . ."
                />
            </div>

            <div className="overflow-x-auto">
                <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">ID</th>
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Gender</th>
                            <th className="border border-gray-300 px-4 py-2">Date of Birth</th>
                            <th className="border border-gray-300 px-4 py-2">Age</th>
                            <th className="border border-gray-300 px-4 py-2">Blood Group</th>
                            <th className="border border-gray-300 px-4 py-2">Contact</th>
                            <th className="border border-gray-300 px-4 py-2">Email</th>
                            <th className="border border-gray-300 px-4 py-2">Address</th>
                            <th className="border border-gray-300 px-4 py-2">User Type</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPatients.length > 0 ? (
                            currentPatients.map((patient) => (
                                <tr key={patient.user_id} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 px-4 py-2">{patient.user_id}</td>
                                    <td className="border border-gray-300 px-4 py-2">{patient.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{patient.gender || "N/A"}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {patient.date_of_birth
                                            ? new Date(patient.date_of_birth).toLocaleDateString()
                                            : "N/A"}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {patient.date_of_birth ? calculateAge(patient.date_of_birth) : "N/A"}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{patient.blood_group || "N/A"}</td>
                                    <td className="border border-gray-300 px-4 py-2">{patient.contact_number || "N/A"}</td>
                                    <td className="border border-gray-300 px-4 py-2">{patient.email}</td>
                                    <td className="border border-gray-300 px-4 py-2">{patient.address || "N/A"}</td>
                                    <td className="border border-gray-300 px-4 py-2">{patient.user_type}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <button
                                            onClick={() => handleViewPatientDetails(patient)} // Open details in Swal
                                            className="btn text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:bg-gradient-to-l"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDeletePatient(patient.user_id, patient.name)}
                                            className="btn text-white bg-gradient-to-r from-red-500 to-red-700 hover:bg-gradient-to-l"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" className="text-center py-4">No results found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center space-x-2">
                {[...Array(Math.ceil(filteredPatients.length / patientsPerPage))].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`px-4 py-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default AdminPatients;
