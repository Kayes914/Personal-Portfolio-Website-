import Hero from "@/components/sections/Hero";
import Works from "@/components/sections/Works";
import About from "@/components/sections/About";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/Navbar";
import JsonLd from "@/components/SEO/JsonLd";

export default function Home() {
  // Portfolio structured data
  const portfolioData = {
    name: "Kayes",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://kayes-portfolio.vercel.app/",
    image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://kayes-portfolio.vercel.app/"}/og-image.png`,
    jobTitle: "Full Stack Web Developer",
    description: "Kayes's portfolio showcasing web development projects, skills, and professional experience in React, Next.js, and full-stack development.",
    websiteName: "Kayes Portfolio",
    socialProfiles: [
      "https://github.com/Kayes914",
      "https://www.linkedin.com/in/mahmudullah-kayes/",
      "https://www.facebook.com/MahmudullahKayes914"
    ]
  };

  return (
    <main className="min-h-screen">
      {/* Add structured data for SEO */}
      <JsonLd type="Portfolio" data={portfolioData} />
      
      <Navbar />
      <Hero />
      <Works />
      <About />
      <Footer />
    </main>
  );
}
