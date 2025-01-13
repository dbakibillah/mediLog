import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Root = () => {
    return (
        <section className="min-h-screen bg-gray-100">
            <Navbar />
            <Outlet />
            <Footer />
        </section>
    );
};

export default Root;