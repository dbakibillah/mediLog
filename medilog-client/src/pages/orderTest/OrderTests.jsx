import axios from "axios";
import { useState, useEffect, useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import { AuthContext } from "../../providers/AuthProviders"; // Assuming you're using AuthContext for user email

const OrderTests = () => {
    const { user } = useContext(AuthContext); // Get the user data from context
    const userEmail = user?.email || ""; // Get the user's email
    const [tests, setTests] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8081/medicaltests")
            .then((response) => {
                setTests(response.data);
                setLoading(false);
            })
            .catch((error) => console.error("Error fetching tests:", error));
    }, []);

    const filteredTests = tests.filter((test) =>
        test.testName.toLowerCase().includes(search.toLowerCase())
    );

    // Function to handle adding a test to the cart
    const handleAddToCart = (test) => {
        // Check if userEmail is available
        if (!userEmail) {
            alert("You need to be logged in to add items to the cart.");
            return;
        }

        // Send the test data and user email to the backend
        const cartData = {
            testName: test.testName,
            price: test.price,
            sampleType: test.sampleType,
            details: test.details,
            resultTime: test.resultTime,
            userEmail: userEmail,  // Include user email
        };

        axios.post("http://localhost:8081/cart", cartData)
            .then((response) => {
                console.log("Test added to cart:", response.data);
                alert("Test added to cart!");
            })
            .catch((error) => {
                console.error("Error adding test to cart:", error);
                alert("Failed to add test to cart.");
            });
    };

    return (
        <section className="container mx-auto lg:px-24 px-6 py-12 min-h-screen">
            <div className="flex w-full justify-end mb-6">
                <SearchBar onSearch={setSearch} searchQuery="Search Tests. . ." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {loading ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                        <div key={idx} className="bg-gray-300 animate-pulse h-48 rounded-lg shadow-md"></div>
                    ))
                ) : filteredTests.length > 0 ? (
                    filteredTests.map((test) => (
                        <div
                            key={test.testName}
                            className="bg-white p-4 rounded-lg shadow-xl transform transition-all hover:shadow-2xl flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-2xl font-semibold text-blue-700 mb-3">{test.testName}</h3>
                                <p className="text-sm text-gray-600 mb-3">{test.details}</p>
                                <span className="text-sm text-gray-600">Result Time: {test.resultTime}</span>
                            </div>
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-blue-600 font-semibold">From ৳{test.price}</p>
                                    <span className="bg-gray-200 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                                        {test.sampleType}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleAddToCart(test)} // Add test to cart when clicked
                                    className="w-full mt-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-6 rounded-lg transition-all hover:bg-gradient-to-l"
                                >
                                    Add To Cart
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-lg text-center text-gray-500">No tests found.</p>
                )}
            </div>
        </section>
    );
};

export default OrderTests;
