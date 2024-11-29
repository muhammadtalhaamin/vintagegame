'use client';

import { SignIn } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

const GameBackground = () => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    // Generate background elements on client-side
    const newElements = [...Array(20)].map((_, index) => ({
      id: index,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 1}s`,
      size: `${Math.random() * 40 + 10}px`,
      duration: `${Math.random() * 5 + 0.3}s`,
      opacity: Math.random() * 0.5 + 0.1
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute animate-geometric-pulse"
          style={{
            width: el.size,
            height: el.size,
            left: el.left,
            top: el.top,
            animationDelay: el.animationDelay,
            borderRadius: '10%', // mix of square and circle
            background: `rgba(255, 255, 255, ${el.opacity})`,
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)',
            filter: 'blur(1px)',
          }}
        />
      ))}
      <div className="absolute inset-0 bg-black opacity-30" />
      <div className="absolute inset-0 animate-grid-overlay opacity-10" />
    </div>
  );
};

export default function Page() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <GameBackground />
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="bg-white/5 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 transform transition-all hover:scale-105 duration-300">
          <SignIn />
        </div>
      </div>
    </div>
  );
}