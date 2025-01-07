import { Helmet } from "react-helmet";
import Banner from "../../components/home/Banner";
import AboutSection from "../../components/home/AboutSection";
import OurServices from "../../components/home/OurServices";
import OurPartners from "../../components/home/OurPartners";
import ContactUs from "../../components/home/ContactUs";
import Faq from "../../components/home/Faq";

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
      <Faq/>
      <ContactUs />
    </section>
  );
};

export default Home;
