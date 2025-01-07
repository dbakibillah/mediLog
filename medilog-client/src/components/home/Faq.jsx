import { useState, useEffect } from "react";

const Faq = () => {
    const [faqs, setFaqs] = useState([]);

    useEffect(() => {
        fetch("/faq.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch FAQ data");
                }
                return response.json();
            })
            .then((data) => setFaqs(data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <section className="container mx-auto px-6 p-2 md:px-24 lg:px-36 py-12">
            <h2 className="text-3xl lg:text-5xl font-bold text-center mb-12 text-blue-600">
                Frequently Asked Questions
            </h2>
            <div className="space-y-4">
                {faqs.map((faq) => (
                    <div key={faq.id} className="collapse group border border-gray-300 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <div
                            tabIndex={0}
                            className="collapse-title text-xl font-medium p-4 cursor-pointer flex justify-between items-center text-blue-800 group-open:text-blue-600"
                        >
                            <span>{faq.ques}</span>
                            <span className="transform transition-transform duration-300 group-focus-within:rotate-180">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </span>
                        </div>
                        <div className="collapse-content p-4 hidden group-open:block">
                            <p className="text-blue-600">{faq.ans}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Faq;
