import { useState } from 'react';

const ContactUs = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Form submitted!');
    };

    return (
        <section className="container mx-auto px-6 lg:px-24 py-12 flex flex-col lg:flex-row items-center gap-12">
            {/* Text Section */}
            <div className="flex-1 text-center lg:text-left space-y-6 animate__animated animate__fadeInLeft">
                <h2 className="text-3xl lg:text-5xl font-bold text-blue-600">Contact Us</h2>
                <p className="text-lg leading-relaxed text-gray-700">
                    Have questions or need assistance? We're here to help. Reach out to us via the form below, and we'll get back to you as soon as possible.
                </p>
                <ul className="space-y-2">
                    <li className="flex items-center justify-center lg:justify-start">
                        <span className="material-icons text-blue-500">phone</span>
                        <span className="ml-2 text-gray-600">+1 (123) 456-7890</span>
                    </li>
                    <li className="flex items-center justify-center lg:justify-start">
                        <span className="material-icons text-blue-500">email</span>
                        <span className="ml-2 text-gray-600">support@medilog.com</span>
                    </li>
                    <li className="flex items-center justify-center lg:justify-start">
                        <span className="material-icons text-blue-500">location_on</span>
                        <span className="ml-2 text-gray-600">123 Main St, Anytown, USA</span>
                    </li>
                </ul>
            </div>

            {/* Form Section */}
            <form className="flex-1 animate__animated animate__fadeInRight" onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your Message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
                    >
                        Send Message
                    </button>
                </div>
            </form>
        </section>
    );
};

export default ContactUs;
