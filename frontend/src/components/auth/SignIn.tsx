import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, PawPrint, Dog, Cat, Bird, Heart, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Signed in successfully!");
      // Redirect to PetProfileSetup after successful sign-in
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Floating Pet Animations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 animate-float-slow">
          <Dog className="w-12 h-12 text-[#4A90E2] opacity-20" />
        </div>
        <div className="absolute top-40 right-20 animate-float-medium">
          <Cat className="w-10 h-10 text-[#FF6F61] opacity-20" />
        </div>
        <div className="absolute bottom-32 left-[20%] animate-float-fast">
          <Bird className="w-8 h-8 text-[#A8E6CF] opacity-20" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-slow"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            <PawPrint className="w-6 h-6 text-[#A8E6CF] opacity-20" />
          </div>
        ))}
      </div>

      <div className="max-w-md w-full space-y-8 relative">
        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Heart className="h-12 w-12 text-[#FF6F61]" />
              <PawPrint className="h-6 w-6 text-[#4A90E2] absolute -bottom-1 -right-1" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#333333]">Welcome Back!</h2>
          <p className="mt-2 text-[#666666]">Sign in to continue to PetAI Health</p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#333333] mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#4A90E2]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#333333] mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#4A90E2]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-11 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-[#666666]" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#666666]" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#4A90E2] focus:ring-[#4A90E2] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#666666]">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[#4A90E2] hover:text-[#357ABD]">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A90E2] transition-colors"
            >
              <PawPrint className="w-5 h-5 mr-2" />
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#666666]">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-[#4A90E2] hover:text-[#357ABD]">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
