import Hero from "@/components/sections/Hero";
import Works from "@/components/sections/Works";
import Expertise from "@/components/sections/Expertise";
import About from "@/components/sections/About";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Works />
      <Expertise />
      <About />
      <Footer />
    </main>
  );
}
