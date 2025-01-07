import { Helmet } from "react-helmet";
import Banner from "../../components/home/Banner";
import AboutSection from "../../components/home/AboutSection";
import OurServices from "../../components/home/OurServices";
import OurPartners from "../../components/home/OurPartners";

const Home = () => {
    return (
        <section className="bg-gray-100">
            <Helmet>
                <title>Medilog | Home</title>
            </Helmet>
            <Banner />
            <AboutSection />
            <OurServices />
            <OurPartners />
        </section>
    );
};

export default Home;