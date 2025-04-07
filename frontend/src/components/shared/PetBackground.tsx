import React from 'react';
import { Dog, Cat, Rabbit, Bird, Fish, PawPrint } from 'lucide-react';

const PetBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.15]">
      {/* Floating Pet Icons */}
      <div className="absolute top-20 left-[10%] animate-float-slow">
        <Dog className="w-12 h-12 text-[#4A90E2]" />
      </div>
      <div className="absolute top-40 right-[15%] animate-float-medium">
        <Cat className="w-10 h-10 text-[#FF6F61]" />
      </div>
      <div className="absolute bottom-32 left-[20%] animate-float-fast">
        <Rabbit className="w-8 h-8 text-[#A8E6CF]" />
      </div>
      <div className="absolute top-60 left-[30%] animate-float-medium">
        <Bird className="w-8 h-8 text-[#4A90E2]" />
      </div>
      <div className="absolute bottom-40 right-[25%] animate-float-slow">
        <Fish className="w-10 h-10 text-[#FF6F61]" />
      </div>
      
      {/* Paw Print Pattern */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-float-slow"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`
          }}
        >
          <PawPrint className="w-6 h-6 text-[#A8E6CF]" />
        </div>
      ))}
    </div>
  );
};

export default PetBackground;