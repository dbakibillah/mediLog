import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProviders";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

const PatientDashboard = () => {
    const { user } = useContext(AuthContext);

    const { data: currentUser, isLoading, isError } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:8081/users-profile/${user.email}`);
            return res.data;
        }
    });

    if (isLoading) {
        return <div className="text-center text-xl text-gray-600">Loading...</div>;
    }

    if (isError || !currentUser) {
        return <div className="text-center text-xl text-red-500">Error fetching user data</div>;
    }

    // Check if any field is missing
    const missingFields = [
        currentUser?.name,
        currentUser?.user_type,
        currentUser?.gender,
        currentUser?.email,
        currentUser?.contact_number,
        currentUser?.blood_group,
    ].some(field => field === null || field === undefined);

    return (
        <section className="container mx-auto lg:px-24 py-8">
            <div className="bg-white rounded-xl shadow-lg p-8 flex items-center lg:flex-row gap-6">
                {/* Profile Image */}
                <figure className="flex-shrink-0 mx-auto lg:mx-0">
                    <img
                        src={currentUser?.photo}
                        alt="User profile"
                        className="w-48 h-48 rounded-full border-4 border-indigo-500 shadow-md"
                    />
                </figure>

                {/* Vertical Divider */}
                <div className="hidden lg:block border-l-2 border-gray-300 h-48 mx-6"></div>

                {/* User Info */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl font-semibold text-gray-800">{currentUser.name}</h1>
                    <p className="text-gray-600 text-lg">{currentUser.user_type} <span className="font-medium">|</span> {currentUser.gender}</p>
                    <p className="text-gray-600 text-lg">
                        Blood Group: <span className="font-medium">{currentUser.blood_group}</span>
                    </p>
                    <p className="text-gray-600 text-lg">{currentUser.email}</p>
                    <p className="text-gray-600 text-lg">{currentUser.contact_number}</p>

                    {/* Show Edit Profile prompt if any field is missing */}
                    {missingFields && (
                        <div className="text-center mt-4">
                            <p className="text-sm text-red-600">
                                Please{" "}
                                <Link to="/dashboard/profile" className="underline text-blue-500 hover:text-blue-700">
                                    update your profile
                                </Link>{" "}
                                to complete your information.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PatientDashboard;
