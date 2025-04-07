import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Facebook, Twitter, Instagram, PawPrint, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#4A90E2] to-[#A8E6CF] text-white py-12 relative">
      {/* Paw Print Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <PawPrint
            key={i}
            className="absolute w-6 h-6"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="relative">
                <Heart className="h-8 w-8 text-[#FF6F61]" />
                <PawPrint className="h-4 w-4 text-white absolute -bottom-1 -right-1" />
              </div>
              <span className="ml-2 text-xl font-bold">Peto AI</span>
            </div>
            <p className="text-[#F5F5F5]">Your Partner in Pet Wellness</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <PawPrint className="w-5 h-5 mr-2" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-[#F5F5F5] hover:text-[#FF6F61] transition-colors">About Us</Link></li>
              <li><Link to="/" className="text-[#F5F5F5] hover:text-[#FF6F61] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="text-[#F5F5F5] hover:text-[#FF6F61] transition-colors">Terms of Service</Link></li>
              <li><Link to="/" className="text-[#F5F5F5] hover:text-[#FF6F61] transition-colors">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <PawPrint className="w-5 h-5 mr-2" />
              Contact Us
            </h3>
            <ul className="space-y-2 text-[#F5F5F5]">
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                support@petoai.com
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                1-800-PET-HEALTH
              </li>
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Banglore
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <PawPrint className="w-5 h-5 mr-2" />
              Follow Us
            </h3>
            <div className="flex space-x-4">
              <a href="#" className="text-[#F5F5F5] hover:text-[#FF6F61] transition-colors transform hover:scale-110">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-[#F5F5F5] hover:text-[#FF6F61] transition-colors transform hover:scale-110">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-[#F5F5F5] hover:text-[#FF6F61] transition-colors transform hover:scale-110">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-[#F5F5F5]/20 mt-8 pt-8 text-center text-[#F5F5F5]">
          <p className="flex items-center justify-center">
            <PawPrint className="w-4 h-4 mr-2" />
            &copy; 2025 Peto AI Health. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;