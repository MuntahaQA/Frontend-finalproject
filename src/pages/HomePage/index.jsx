import { getCurrentUser } from "../../utilities/api";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import Mission from "../../components/Mission";
import Programs from "../../components/Programs";
import HowItWorks from "../../components/HowItWorks";
import Impact from "../../components/Impact";
import CallToAction from "../../components/CallToAction";
import Footer from "../../components/Footer";
import "./styles.css";

export default function HomePage() {
  // Authentication & role (without AuthContext)
  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(token);

  const user = getCurrentUser();
  const isMinistryUser =
    Boolean(user?.is_ministry_user) ||
    Boolean(user?.is_staff) ||
    Boolean(user?.is_superuser);

  return (
    <main>
      <Navbar />
      {isAuthenticated && isMinistryUser ? (
        <>
          <Footer />
        </>
      ) : (
        <>
          <Hero />
          <Mission />
          <Programs />
          <HowItWorks />
          <Impact />
          <CallToAction />
          <Footer />
        </>
      )}
    </main>
  );
}
