import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import AboutSection from '../components/landing/AboutSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import Footer from '../components/landing/Footer';
import DevelopersSection from '../components/landing/DevelopersSection';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <DevelopersSection />
      <Footer />
    </div>
  );
};

export default LandingPage;