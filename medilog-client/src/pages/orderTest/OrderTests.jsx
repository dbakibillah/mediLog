import axios from "axios";
import { useState, useEffect } from "react";

const OrderTests = () => {
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

    return (
        <section className="container mx-auto px-6 p-2 md:px-24 lg:px-36 py-12 bg-gray-100">
            <div className="mb-6 flex items-center justify-between gap-4 p-4">
                <div className="relative w-full max-w-xs">
                    <input
                        type="text"
                        placeholder="Search tests by name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-3 pl-10 text-gray-800 bg-gray-100 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                        <div key={idx} className="bg-gray-300 animate-pulse h-48 rounded"></div>
                    ))
                ) : filteredTests.length > 0 ? (
                    filteredTests.map((test) => (
                        <div
                            key={test.testName}
                            className="bg-white p-4 rounded shadow flex flex-col justify-between"
                        >
                            <h3 className="text-xl font-bold mb-2">{test.testName}</h3>
                            <p className="text-sm text-gray-600 mb-2">{test.details}</p>
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-sm text-gray-600">From ৳{test.price}</p>
                                <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded">
                                    {test.sampleType}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                    Result Time: {test.resultTime}
                                </span>
                                <button
                                    className="btn bg-blue-500 text-white rounded border-none hover:bg-blue-700"
                                >
                                    Add To Cart
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No tests found.</p>
                )}
            </div>
        </section>
    );
};

export default OrderTests;
