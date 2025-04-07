import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, X, ChevronDown, Dog, Cat, Stethoscope, PawPrint } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeatureDropdownOpen, setIsFeatureDropdownOpen] = useState(false);

  const features = [
    {
      title: 'Petcare Chatbot',
      link: '/chatbot',
      icon: <Dog className="w-5 h-5" />
    },
    {
      title: 'Diet Planner',
      link: '/diet-planner',
      icon: <Cat className="w-5 h-5" />
    },
    {
      title: 'Health Dashboard',
      link: '/health-dashboard',
      icon: <Stethoscope className="w-5 h-5" />
    },
    {
      title: 'Gamified Ranking',
      link: '/gamified-ranking',
      icon: <PawPrint className="w-5 h-5" />
    },
  ];

  return (
    <nav className="bg-gradient-to-r from-[#4A90E2] to-[#A8E6CF] shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="relative">
                <Heart className="h-8 w-8 text-white" />
                <PawPrint className="h-4 w-4 text-[#FF6F61] absolute -bottom-1 -right-1" />
              </div>
              <span className="ml-2 text-xl font-bold text-white">Peto AI</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-[#FF6F61] transition-colors">Home</Link>
            
            {/* Features Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center text-white hover:text-[#FF6F61] focus:outline-none transition-colors"
                onClick={() => setIsFeatureDropdownOpen(!isFeatureDropdownOpen)}
              >
                <span>Features</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute left-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out transform group-hover:translate-y-0 translate-y-1">
                <div className="py-2 px-1">
                  {features.map((feature, index) => (
                    <Link
                      key={index}
                      to={feature.link}
                      className="flex items-center px-4 py-3 text-sm text-[#333333] hover:bg-[#F5F5F5] hover:text-[#4A90E2] rounded-md transition-colors"
                    >
                      <span className="text-[#4A90E2] mr-3">{feature.icon}</span>
                      {feature.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <button className="bg-[#FF6F61] text-white px-6 py-2 rounded-full hover:bg-[#ff8a7f] transition-colors flex items-center">
              <PawPrint className="w-4 h-4 mr-2" />
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#FF6F61] transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#A8E6CF]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="flex items-center px-3 py-2 text-[#333333] hover:bg-[#F5F5F5] rounded-md">
              <PawPrint className="w-5 h-5 mr-3 text-[#4A90E2]" />
              Home
            </Link>
            
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="flex items-center px-3 py-2 text-[#333333] hover:bg-[#F5F5F5] rounded-md"
              >
                <span className="text-[#4A90E2] mr-3">{feature.icon}</span>
                {feature.title}
              </Link>
            ))}

            <button className="w-full flex items-center px-3 py-2 text-[#FF6F61] hover:bg-[#F5F5F5] rounded-md">
              <PawPrint className="w-5 h-5 mr-3" />
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;