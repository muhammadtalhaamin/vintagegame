'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Code, Play, Wand2 } from 'lucide-react';
import axios from 'axios';

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([]);
  const [food, setFood] = useState(null);
  const [direction, setDirection] = useState('RIGHT');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [editableCode, setEditableCode] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Game configuration
  const gridSize = 20;
  const canvasSize = 400;

  // Safely generate food
  const generateFood = () => {
    const gridWidth = canvasSize / gridSize;
    
    while (true) {
      const x = Math.floor(Math.random() * gridWidth) * gridSize;
      const y = Math.floor(Math.random() * gridWidth) * gridSize;
      
      if (!snake.some(segment => segment.x === x && segment.y === y)) {
        return { x, y };
      }
    }
  };

  // Default game initialization
  const defaultInitGame = () => {
    const centerX = Math.floor(canvasSize / (2 * gridSize)) * gridSize;
    const centerY = Math.floor(canvasSize / (2 * gridSize)) * gridSize;
    
    setSnake([{ x: centerX, y: centerY }]);
    setFood(generateFood());
    setDirection('RIGHT');
    setScore(0);
    setGameOver(false);
  };

  // Initial setup
  useEffect(() => {
    // Initialize default game code
    setEditableCode(`// Custom Snake Game Logic
const initGame = () => {
  const centerX = Math.floor(canvasSize / (2 * gridSize)) * gridSize;
  const centerY = Math.floor(canvasSize / (2 * gridSize)) * gridSize;
  
  setSnake([{ x: centerX, y: centerY }]);
  setFood(generateFood());
  setDirection('RIGHT');
  setScore(0);
  setGameOver(false);
};

// You can customize game initialization logic here
`);

    // Initialize game
    defaultInitGame();
  }, []);

  // Game movement and rendering logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const moveSnake = () => {
      if (gameOver) return;

      const head = { ...snake[0] };

      // Move based on current direction
      switch (direction) {
        case 'RIGHT': head.x += gridSize; break;
        case 'LEFT': head.x -= gridSize; break;
        case 'UP': head.y -= gridSize; break;
        case 'DOWN': head.y += gridSize; break;
      }

      // Wall collision
      if (
        head.x < 0 || 
        head.x >= canvasSize || 
        head.y < 0 || 
        head.y >= canvasSize
      ) {
        setGameOver(true);
        return;
      }

      // Self-collision
      if (snake.slice(1).some(segment => 
        segment.x === head.x && segment.y === head.y
      )) {
        setGameOver(true);
        return;
      }

      // Food collision
      const ateFruit = food && head.x === food.x && head.y === food.y;
      
      // Update snake
      const newSnake = [head, ...snake.slice(0, ateFruit ? undefined : -1)];
      
      setSnake(newSnake);
      
      if (ateFruit) {
        setScore(prevScore => prevScore + 1);
        setFood(generateFood());
      }
    };

    // Drawing logic
    const draw = () => {
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      // Draw snake head
      const head = snake[0];
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(head.x + gridSize / 2, head.y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      // Draw snake eyes
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(head.x + gridSize / 3, head.y + gridSize / 3, gridSize / 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.arc(head.x + gridSize / 3 * 2, head.y + gridSize / 3, gridSize / 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      // Draw snake body
      ctx.fillStyle = 'gray';
      snake.slice(1).forEach(segment => {
        ctx.beginPath();
        ctx.arc(segment.x + gridSize / 2, segment.y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      });

      // Draw food
      if (food) {
        ctx.fillStyle = 'Gray';
        ctx.fillRect(food.x, food.y, gridSize, gridSize);
      }
    };

    // Game loop
    const gameLoop = setInterval(() => {
      if (!gameOver) {
        moveSnake();
        draw();
      }
    }, 100);

    return () => clearInterval(gameLoop);
  }, [snake, food, direction, gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // Toggle code view
  const toggleCodeView = () => {
    setShowCode(!showCode);
  };

  // Apply code changes
  const applyCodeChanges = () => {
    try {
      // Create a safe execution context with necessary game state and functions
      const safeContext = {
        canvasSize,
        gridSize,
        setSnake,
        setFood,
        setDirection,
        setScore,
        setGameOver,
        generateFood
      };

      // Dynamically evaluate the code
      const initFunction = new Function(
        ...Object.keys(safeContext), 
        `return function() { 
          ${editableCode}
          return initGame;
        }`
      )(...Object.values(safeContext))();

      // Override default initialization with custom function
      if (typeof initFunction === 'function') {
        initFunction();
      } else {
        defaultInitGame();
      }

      alert('Code changes applied successfully!');
    } catch (error) {
      console.error('Error applying code changes:', error);
      alert('Failed to apply code changes. Please check your code.');
      // Fallback to default initialization
      defaultInitGame();
    }
  };

  
  const getAiSuggestion = async () => {
    if (!aiPrompt.trim()) return;
  
    setIsLoading(true);
    try {
      const response = await axios.post('/api/snake', {
        prompt: `Modify the initGame function to: ${aiPrompt}
  
        Provide ONLY the function body. Do not include function declaration, code blocks, or any markdown. 
        Use the following parameters if needed: setSnake, setFood, setDirection, setScore, setGameOver, canvasSize, gridSize, generateFood.
        
        Example output format (no code fences or extra text):
        const centerX = Math.floor(canvasSize / (2 * gridSize)) * gridSize;
        const centerY = Math.floor(canvasSize / (2 * gridSize)) * gridSize;
        setSnake([{ x: centerX, y: centerY }]);
        setFood(generateFood());
        setDirection('RIGHT');
        setScore(0);
        setGameOver(false);`,
        model: 'gpt-4o'
      });
  
      const suggestion = response.data.suggestion;
      
      // Replace the entire editableCode with a new implementation
      setEditableCode(`const initGame = () => {
    ${suggestion.trim()}
  };`);
  
      setIsLoading(false);
      alert('AI suggestion applied. Apply changes to test.');
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
      alert('Failed to get AI suggestion. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 flex items-center justify-center gap-4">
          <Play className="text-gray-600" />
          Snake Game
          <Code className="text-gray-600" />
        </h1>

        <div className="flex space-x-6">
          {/* Game Container */}
          <div className={`${showCode ? 'w-1/2' : 'w-full'} bg-white shadow-xl rounded-lg p-6 transition-all duration-300`}>
            <div className="flex flex-col items-center">
              <canvas 
                ref={canvasRef} 
                width={canvasSize} 
                height={canvasSize} 
                className="border-4 border-gray-500 rounded-md shadow-md"
              ></canvas>
              
              <div className="mt-4 flex items-center space-x-4 pt-5">
                <p className="text-xl font-semibold">Score: 
                  <span className="text-gray-600 ml-2">{score}</span>
                </p>
                
                {gameOver && (
                  <Button 
                    onClick={defaultInitGame}
                    variant="outline"
                    className="bg-black text-white hover:bg-gray-300"
                  >
                    Play Again
                  </Button>
                )}

                <Button 
                  onClick={toggleCodeView} 
                  variant="outline"
                  className="ml-4"
                >
                  {showCode ? 'Hide Code' : 'Show Code'}
                </Button>
              </div>
            </div>
          </div>

          {/* Code Editor Container */}
          {showCode && (
            <div className="w-1/2 bg-white shadow-xl rounded-lg p-6">
              <Card className="w-full h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="text-blue-600" />
                    Game Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={editableCode}
                    onChange={(e) => setEditableCode(e.target.value)}
                    className="w-full h-[350px] font-mono text-sm bg-gray-50 border-2 border-blue-100"
                    placeholder="Edit your game code here"
                  />
                  
                  {/* Apply Code Changes Button */}
                  <Button 
                    onClick={applyCodeChanges}
                    className="mt-4 w-full"
                  >
                    Apply Code Changes
                  </Button>

                  {/* AI Code Suggestion Section */}
                  <div className="mt-4 flex space-x-2">
                    <Input 
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Ask AI to modify the game code"
                      className="flex-grow"
                    />
                    <Button 
                      onClick={getAiSuggestion}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      {isLoading ? 'Generating...' : (
                        <>
                          <Wand2 className="w-4 h-4" />
                          Suggest
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;