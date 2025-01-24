import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../providers/AuthProviders";
import Swal from "sweetalert2";

const EditProfile = () => {
    const { user } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);

    // Fetch user data
    const { data: currentUser, isLoading, isError, refetch } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:8081/users-profile/${user.email}`);
            return response.data;
        },
    });

    // Form state for updates
    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        date_of_birth: "",
        blood_group: "",
        contact_number: "",
        address: "",
        about: "",
        photo: "",
    });

    // Set form data once user is fetched
    useEffect(() => {
        if (currentUser) {
            const date_of_birth = currentUser.date_of_birth ? currentUser.date_of_birth.split("T")[0] : "";
            setFormData({ ...currentUser, date_of_birth });
        }
    }, [currentUser]);

    // Function to handle profile update
    const updateUserProfile = async (updatedData) => {
        try {
            const response = await axios.put(
                `http://localhost:8081/users-profile/${user.email}`,
                updatedData
            );
            refetch();
            Swal.fire({
                title: "Success!",
                text: "Profile updated successfully!",
                icon: "success",
                timer: 3000,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to update profile. Please try again later.",
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
            });
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        updateUserProfile(formData);
        setIsEditing(false);
    };

    if (isLoading) {
        return <div className="text-center text-xl text-gray-600">Loading...</div>;
    }

    if (isError) {
        return <div className="text-center text-red-500 text-xl">Error loading user data. Please try again later.</div>;
    }

    return (
        <section className="container mx-auto p-8 lg:px-24 flex justify-center items-start min-h-screen bg-gray-50">
            <div className="w-full lg:w-10/12 p-8 bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:space-x-16">
                    {/* Profile Info Section */}
                    <div className="flex-1 mb-8 lg:mb-0 text-center lg:text-left space-y-6">
                        <img
                            src={user.photoURL || "https://via.placeholder.com/150"}
                            alt="Profile"
                            className="w-40 h-40 rounded-full object-cover border-4 border-gradient-to-r from-blue-500 to-indigo-700 mb-4 mx-auto lg:mx-0"
                        />
                        <h2 className="text-4xl font-semibold text-gray-800">{currentUser.name}</h2>
                        <p className="text-lg text-gray-600"><span className="font-semibold">User Type:</span> {currentUser.user_type}</p>
                        <p className="text-lg text-gray-600"><span className="font-semibold">Email:</span> {currentUser.email}</p>
                        <p className="text-lg text-gray-600"><span className="font-semibold">Contact:</span> {currentUser.contact_number}</p>
                        <p className="text-lg text-gray-600"><span className="font-semibold">Address:</span> {currentUser.address}</p>
                        <p className="text-lg text-gray-600 mb-6"><span className="font-semibold">About:</span><br />{currentUser.about}</p>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`w-full px-6 py-3 text-white rounded-lg transition-all ease-in-out duration-300 ${isEditing ? 'bg-gradient-to-r from-red-500 to-red-700 hover:bg-gradient-to-l' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:bg-gradient-to-l'}`}
                        >
                            {isEditing ? "Cancel Editing" : "Edit Profile"}
                        </button>
                    </div>

                    {/* Edit Form Section */}
                    <div className="flex-1 space-y-4">
                        <form onSubmit={handleSubmit} className={`${!isEditing && "hidden"} space-y-4`}>
                            <div>
                                <label className="label">
                                    <span className="label-text font-bold">Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    readOnly
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="label">
                                        <span className="label-text font-bold">Gender</span>
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="label">
                                        <span className="label-text font-bold">Blood Group</span>
                                    </label>
                                    <select
                                        name="blood_group"
                                        value={formData.blood_group}
                                        onChange={handleChange}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="">Select Blood Group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text font-bold">Date of Birth</span>
                                </label>
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={formData.date_of_birth}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text font-bold">Contact Number</span>
                                </label>
                                <input
                                    type="text"
                                    name="contact_number"
                                    value={formData.contact_number}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text font-bold">Address</span>
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="textarea textarea-bordered w-full"
                                ></textarea>
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text font-bold">About</span>
                                </label>
                                <textarea
                                    name="about"
                                    value={formData.about}
                                    onChange={handleChange}
                                    className="textarea textarea-bordered w-full"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="px-6 py-3 w-full bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:bg-gradient-to-l transition-all ease-in-out duration-300"
                            >
                                Update Profile
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EditProfile;
