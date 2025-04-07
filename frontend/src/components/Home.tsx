import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  Heart,
  MessageSquare,
  Upload,
  BarChart3,
  Trophy,
  Facebook,
  Twitter,
  Instagram,
  ChevronDown,
  PawPrint,
  Dog,
  Cat
} from 'lucide-react';

function Home() {
  const [isFeatureDropdownOpen, setIsFeatureDropdownOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  // Check if the user is authenticated on mount
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate('/signup');
  };

  const features = [
    {
      title: 'Petcare Chatbot',
      description: 'Multilingual, voice-enabled AI chatbot for personalized pet care advice.',
      icon: <MessageSquare className="w-6 h-6" />,
      link: '/chatbot'
    },
    {
      title: 'Diet Planner',
      description: 'Customized meal plans based on breed, age, and health conditions.',
      icon: <Heart className="w-6 h-6" />,
      link: '/diet-planner'
    },
    {
      title: 'Disease Detection',
      description: 'Upload images for instant disease detection with confidence scores and first-aid recommendations.',
      icon: <Upload className="w-6 h-6" />,
      link: '#'
    },
    {
      title: 'Health Dashboard',
      description: "Track your pet's health trends, detect anomalies, and download reports for vet visits.",
      icon: <BarChart3 className="w-6 h-6" />,
      link: '/health-dashboard'
    },
    {
      title: 'Gamified Health Ranking',
      description: 'Monthly health scores, leaderboards, and rewards to keep your pet in top shape.',
      icon: <Trophy className="w-6 h-6" />,
      link: '/gamified-ranking'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] relative">
      {/* Header: Show Logout button only if logged in */}
      {session && (
        <header className="absolute top-0 right-0 p-4 z-10">
          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-lg"
          >
            Logout
          </button>
        </header>
      )}

      {/* Modal Popup for non-authenticated users */}
      {!session && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto text-center">
            {/* You can add a pet icon image here if available */}
            <PawPrint className="w-16 h-16 text-[#FF6F61] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Welcome, Pet Parent!</h2>
            <p className="mb-6 text-lg">
              Please sign in or sign up to unlock all features.
            </p>
            <div className="flex justify-center space-x-6">
              <button 
                onClick={() => navigate('/signin')}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-lg"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-lg"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#4A90E2] to-[#A8E6CF] pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="absolute top-10 left-10 animate-float-slow">
            <Dog className="w-16 h-16 text-white opacity-20" />
          </div>
          <div className="absolute top-20 right-20 animate-float-medium">
            <Cat className="w-12 h-12 text-white opacity-20" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Revolutionizing Pet Health with AI-Powered Solutions
          </h1>
          <p className="text-xl text-white mb-8">
            Personalized care, real-time diagnostics, and expert advice for your furry friends.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-[#FF6F61] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#ff8a7f] transition-colors flex items-center justify-center">
              <PawPrint className="w-5 h-5 mr-2" />
              Get Started for Free
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white/10 flex items-center justify-center">
              <Heart className="w-5 h-5 mr-2" />
              Learn More
            </button>
          </div>
        </div>
        <div className="absolute inset-0 z-[-1] opacity-20">
          <img
            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=2070&h=1000"
            alt="Happy dog"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">What We Offer</h2>
            <p className="text-xl text-[#333333]">
              Explore our cutting-edge features designed to keep your pet healthy and happy.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="bg-[#F5F5F5] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-[#A8E6CF] group"
              >
                <div className="w-12 h-12 bg-[#4A90E2]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#4A90E2]/20 transition-colors">
                  <div className="text-[#4A90E2]">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-[#333333] mb-2">{feature.title}</h3>
                <p className="text-[#333333]">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">How It Works</h2>
            <p className="text-xl text-[#333333]">Simple steps to get started with PetAI Health.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Sign Up & Create a Pet Profile',
                description: 'Create an account and add your pets with their details.',
              },
              {
                step: '02',
                title: 'Use Our AI Tools',
                description: 'Access our suite of AI-powered tools for diagnostics and care.',
              },
              {
                step: '03',
                title: 'Track Progress',
                description: "Monitor your pet's health and get real-time insights.",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#4A90E2] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-[#333333] mb-2">{item.title}</h3>
                <p className="text-[#333333]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">What Pet Parents Say</h2>
            <p className="text-xl text-[#333333]">Join thousands of happy pet owners who trust PetAI Health.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                pet: 'Dog Owner',
                quote: "PetAI Health helped me detect my dog's allergy early. Highly recommended!",
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
              },
              {
                name: 'Mike Peters',
                pet: 'Cat Owner',
                quote: 'The AI chatbot is incredibly helpful for quick advice. It saved me countless vet visits!',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150',
              },
              {
                name: 'Emily Chen',
                pet: 'Multiple Pets',
                quote: 'The health dashboard helps me keep track of all my pets in one place. Amazing!',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-[#F5F5F5] p-6 rounded-lg shadow-md border border-[#A8E6CF]">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold text-[#333333]">{testimonial.name}</h4>
                    <p className="text-[#333333]">{testimonial.pet}</p>
                  </div>
                </div>
                <p className="text-[#333333] italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#4A90E2] to-[#A8E6CF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Pet's Health?
          </h2>
          <p className="text-xl text-white mb-8">
            Sign up today and experience the future of pet care.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-[#FF6F61] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#ff8a7f] transition-colors flex items-center justify-center">
              <PawPrint className="w-5 h-5 mr-2" />
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white/10 flex items-center justify-center">
              <Heart className="w-5 h-5 mr-2" />
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
