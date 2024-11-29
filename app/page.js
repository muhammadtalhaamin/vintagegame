'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

const RetroAnimations = () => {
  const [asteroids, setAsteroids] = useState([]);

  useEffect(() => {
    const generateAsteroids = () => {
      return [...Array(20)].map(() => ({
        id: Math.random(),
        x: Math.random() * 100 + '%',
        y: Math.random() * 100 + '%',
        size: Math.random() * 50 + 10,
        speed: Math.random() * 5 + 1,
      }));
    };

    setAsteroids(generateAsteroids());
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {asteroids.map((asteroid) => (
        <motion.div
          key={asteroid.id}
          className="absolute bg-gray-600 rounded-full pixel-border"
          style={{
            width: `${asteroid.size}px`,
            height: `${asteroid.size}px`,
            left: asteroid.x,
            top: asteroid.y,
          }}
          animate={{ y: '150%', opacity: [1, 0] }}
          transition={{
            duration: asteroid.speed,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
};

export default function VintageLandingPage() {
  const features = [
    {
      title: 'Timeless Design',
      description: 'Experience the simplicity of classic black-and-white gaming.',
      icon: '🎮',
    },
    {
      title: 'Monochrome Graphics',
      description: 'Minimalist visuals that captivate and inspire nostalgia.',
      icon: '🖤',
    },
    {
      title: 'Retro Animations',
      description: 'Dynamic movement inspired by vintage arcade aesthetics.',
      icon: '⬛',
    },
  ];

  const games = [
    {
      title: 'Ping Pong',
      description: 'Relive the first-ever arcade game with vintage-style paddle fun.',
      image: '/pingpong.png', // Replace with your image URL
      link: '/dashboard/games/pingpong',
    },
    {
      title: 'Tetris',
      description: 'Enjoy the classic tile-matching puzzle that defined a generation.',
      image: '/tetris.png', // Replace with your image URL
      link: '/dashboard/games/tetris',
    },
    {
      title: 'Snake',
      description: 'Guide the snake to eat food and grow, but don’t crash!',
      image: '/snake.png', // Replace with your image URL
      link: '/dashboard/games/snake',
    },
  ];

  const pricingPlans = [
    {
      title: 'Classic Player',
      price: '$4.99',
      features: ['Access to 5 Games', 'Monochrome Themes', 'Standard Support'],
    },
    {
      title: 'Arcade Hero',
      price: '$14.99',
      features: [
        'Access to 20+ Games',
        'Custom Themes',
        'Priority Support',
        'Exclusive Pixel Art Avatars',
      ],
      recommended: true,
    },
    {
      title: 'Game Master',
      price: 'Contact Us',
      features: [
        'Unlimited Games',
        'Game Modding Tools',
        'Dedicated Support',
        'Custom Arcade Machines',
      ],
    },
  ];

  const testimonials = [
    {
      name: 'John Doe',
      quote: 'This platform took me back to the golden age of gaming. A must-try!',
      avatar: '🕹️',
    },
    {
      name: 'Jane Smith',
      quote: 'The monochrome design is stunning. It feels like the 80s all over again!',
      avatar: '👾',
    },
    {
      name: 'Mike Retro',
      quote: 'Vintage Games Studio perfectly blends nostalgia with modern fun.',
      avatar: '🎲',
    },
  ];


  return (
    <div className="relative min-h-screen bg-black text-white font-mono overflow-hidden">
      <RetroAnimations />
      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Header Section */}
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold pixel-text mb-4 text-gray-200">
            Vintage Games Studio
          </h1>
          <TypeAnimation
            sequence={[
              'Monochrome Magic Awaits!',
              2000,
              'Relive the Retro Era!',
              2000,
              'Create Timeless Games!',
              2000,
            ]}
            wrapper="span"
            speed={40}
            repeat={Infinity}
            className="text-xl block text-gray-400"
          />
          <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
            A minimalist platform bringing black-and-white vintage games back to life.
          </p>
          <Link href="/dashboard">
            <motion.button
              className="mt-6 px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-full"
              whileHover={{ scale: 1.1 }}
            >
              Play Now!
            </motion.button>
          </Link>
        </header>

        {/* Features Section */}
        <section className="mb-16 bg-gray-800 px-6 py-12 rounded-xl">
          <h2 className="text-4xl text-center pixel-text text-gray-300 mb-8">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-4 bg-gray-900 border-2 border-gray-600 rounded-lg text-center"
                whileHover={{ scale: 1.05, rotate: 2 }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 pixel-text text-gray-200">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Games Section */}
        <section className="mb-16">
          <h2 className="text-4xl text-center pixel-text text-gray-300 mb-8">
            Featured Games
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={index}
                className="p-6 bg-gray-900 border-2 border-gray-600 rounded-lg"
                whileHover={{ scale: 1.1 }}
              >
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-2xl font-bold mb-2 text-gray-200 pixel-text">
                  {game.title}
                </h3>
                <p className="text-gray-400 mb-4">{game.description}</p>
                <Link href={game.link}>
                  <motion.button
                    className="bg-gray-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-600"
                    whileHover={{ scale: 1.1 }}
                  >
                    Play {game.title}
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mb-16">
          <h2 className="text-4xl text-center pixel-text text-gray-300 mb-8">
            Pricing Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                className={`p-6 border-2 ${
                  plan.recommended ? 'border-gray-400' : 'border-gray-600'
                } bg-gray-900 text-center rounded-lg`}
                whileHover={{ scale: 1.1 }}
              >
                <h3 className="text-2xl font-bold mb-2 text-gray-200 pixel-text">
                  {plan.title}
                </h3>
                <div className="text-3xl font-bold mb-4 text-gray-400">
                  {plan.price}
                </div>
                <ul className="mb-4 text-gray-400">
                  {plan.features.map((feature, i) => (
                    <li key={i}>✓ {feature}</li>
                  ))}
                </ul>
                <button className="bg-gray-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-600">
                  Choose Plan
                </button>
              </motion.div>
            ))}
          </div>
        </section>


        {/* Testimonials Section */}
        <section className="mb-16 bg-gray-800 px-6 py-12 rounded-xl">
          <h2 className="text-4xl text-center pixel-text text-gray-300 mb-8">
            Testimonials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-6 bg-gray-900 border-2 border-gray-600 rounded-lg text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-5xl mb-4">{testimonial.avatar}</div>
                <blockquote className="italic text-gray-400 mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <p className="text-gray-300 font-bold">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="mb-16">
          <h2 className="text-4xl text-center pixel-text text-gray-300 mb-8">
            Contact Us
          </h2>
          <p className="text-gray-400 text-center mb-4">
            Have questions or want to collaborate? Reach out to us!
          </p>
          <div className="text-center">
            <Link href="mailto:support@vintagearcadestudio.com">
              <motion.button
                className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-full"
                whileHover={{ scale: 1.1 }}
              >
                Email Us
              </motion.button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
