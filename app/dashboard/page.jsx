'use client';

import Link from 'next/link';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex-col items-center justify-center p-4 pt-14">
      <h1 className="text-4xl font-bold mb-8 text-center text-white font-retro">Welcome to Vintage Games Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Pingpong Card */}
        <Link href="dashboard/games/pingpong">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative">
            <img src="/pingpong.png" alt="Pingpong" className="w-full h-48 object-cover rounded-t-lg mb-4 pixel-art" />
            <h2 className="text-2xl font-semibold mb-4 text-white font-retro">Pingpong</h2>
            <p className="text-gray-300 font-retro">Play a classic game of Pingpong and challenge your reflexes.</p>
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-lg"></div>
          </div>
        </Link>

        {/* Snake Card */}
        <Link href="dashboard/games/snake">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative">
            <img src="/snake.png" alt="Snake" className="w-full h-48 object-cover rounded-t-lg mb-4 pixel-art" />
            <h2 className="text-2xl font-semibold mb-4 text-white font-retro">Snake</h2>
            <p className="text-gray-300 font-retro">Navigate the snake to eat food and grow longer without hitting the walls.</p>
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-lg"></div>
          </div>
        </Link>

        {/* Tetris Card */}
        <Link href="dashboard/games/tetris">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative">
            <img src="/tetris.png" alt="Tetris" className="w-full h-48 object-cover rounded-t-lg mb-4 pixel-art" />
            <h2 className="text-2xl font-semibold mb-4 text-white font-retro">Tetris</h2>
            <p className="text-gray-300 font-retro">Stack the falling blocks to create complete lines and score points.</p>
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-lg"></div>
          </div>
        </Link>

        {/* Create New Game Card */}
        <Link href="/dashboard/games/new">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex items-center justify-center relative">
            <div className="text-6xl text-gray-400 font-retro">+</div>
            <p className="text-gray-300 mt-2 ml-2 font-retro">Create a new game</p>
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-lg"></div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;