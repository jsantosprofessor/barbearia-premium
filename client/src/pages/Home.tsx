import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import Footer from "@/components/Footer";

/**
 * Home Page
 * Design: Premium barbershop landing page with hero, services, gallery, and contact
 * Features: Full-page layout with all main sections
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Services />
      <Gallery />
      <About />
      <Footer />
    </div>
  );
}
