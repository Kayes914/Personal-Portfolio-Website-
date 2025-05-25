import Hero from "@/components/sections/Hero";
import Works from "@/components/sections/Works";
import About from "@/components/sections/About";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Works />
      <About />
      <Footer />
    </main>
  );
}
