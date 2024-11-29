'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Code, Play, Wand2 } from 'lucide-react';
import axios from 'axios';

const PingPongGame = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [showCode, setShowCode] = useState(false);
  const [editableCode, setEditableCode] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Game state
  const [gameState, setGameState] = useState({
    paddle1Y: 200,  // Player paddle
    paddle2Y: 200,  // AI paddle
    ballX: 300,
    ballY: 200,
    ballSpeedX: 5,
    ballSpeedY: 5,
    score1: 0,
    score2: 0,
    difficulty: 0.7  // AI difficulty (0-1)
  });

  // Game constants
  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 400;
  const PADDLE_WIDTH = 10;
  const PADDLE_HEIGHT = 100;
  const BALL_SIZE = 10;
  const PADDLE_SPEED = 10;

  // AI Paddle Movement
  const moveAIPaddle = useCallback((ballY) => {
    const { paddle2Y, difficulty } = gameState;
    const centerPaddle = paddle2Y + PADDLE_HEIGHT / 2;
    const paddleSpeed = PADDLE_SPEED * difficulty;

    // Add some randomness to make AI less perfect
    const randomFactor = Math.random() * 10 - 5;
    
    if (ballY < centerPaddle - randomFactor) {
      return Math.max(0, paddle2Y - paddleSpeed);
    } else if (ballY > centerPaddle + randomFactor) {
      return Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, paddle2Y + paddleSpeed);
    }
    return paddle2Y;
  }, [gameState]);

  // Default game initialization
  const defaultInitGame = useCallback(() => {
    setGameState({
      paddle1Y: 200,
      paddle2Y: 200,
      ballX: 300,
      ballY: 200,
      ballSpeedX: 5,
      ballSpeedY: 5,
      score1: 0,
      score2: 0,
      difficulty: 0.7
    });
  }, []);

  // Initial setup
  useEffect(() => {
    // Initialize default game code
    setEditableCode(`// Custom Ping Pong Game Initialization
const initGame = () => {
  const defaultGameState = {
    paddle1Y: 200,
    paddle2Y: 200,
    ballX: 300,
    ballY: 200,
    ballSpeedX: 5,
    ballSpeedY: 5,
    score1: 0,
    score2: 0,
    difficulty: 0.7
  };
  
  setGameState(defaultGameState);
};

// You can customize game initialization logic here
`);

    // Initialize game
    defaultInitGame();
  }, [defaultInitGame]);

  // Game logic and rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw the game
    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw paddles
      ctx.fillStyle = 'white';
      ctx.fillRect(0, gameState.paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, gameState.paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Draw ball
      ctx.beginPath();
      ctx.arc(gameState.ballX, gameState.ballY, BALL_SIZE / 2, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.closePath();

      // Draw scores
      ctx.fillStyle = 'white';
      ctx.font = '30px Arial';
      ctx.fillText(gameState.score1.toString(), 100, 50);
      ctx.fillText(gameState.score2.toString(), CANVAS_WIDTH - 100, 50);
    };

    // Game loop
    const gameLoop = () => {
      // Calculate new ball position
      const newBallX = gameState.ballX + gameState.ballSpeedX;
      const newBallY = gameState.ballY + gameState.ballSpeedY;

      // AI Paddle Movement
      const newPaddle2Y = moveAIPaddle(newBallY);

      let newScore1 = gameState.score1;
      let newScore2 = gameState.score2;
      let finalBallX = newBallX;
      let finalBallY = newBallY;
      let newBallSpeedX = gameState.ballSpeedX;
      let newBallSpeedY = gameState.ballSpeedY;

      // Ball collision with top and bottom
      if (newBallY + BALL_SIZE / 2 > CANVAS_HEIGHT || newBallY - BALL_SIZE / 2 < 0) {
        newBallSpeedY = -gameState.ballSpeedY;
        finalBallY = newBallY;
      }

      // Ball collision with paddles
      if (
        (newBallX - BALL_SIZE / 2 < PADDLE_WIDTH && 
         newBallY > gameState.paddle1Y && 
         newBallY < gameState.paddle1Y + PADDLE_HEIGHT) ||
        (newBallX + BALL_SIZE / 2 > CANVAS_WIDTH - PADDLE_WIDTH && 
         newBallY > newPaddle2Y && 
         newBallY < newPaddle2Y + PADDLE_HEIGHT)
      ) {
        newBallSpeedX = -gameState.ballSpeedX;
        finalBallX = newBallX;
      }

      // Ball out of bounds
      if (finalBallX - BALL_SIZE / 2 < 0) {
        newScore2 += 1;
        finalBallX = CANVAS_WIDTH / 2;
        finalBallY = CANVAS_HEIGHT / 2;
        newBallSpeedX = Math.abs(gameState.ballSpeedX);
      } else if (finalBallX + BALL_SIZE / 2 > CANVAS_WIDTH) {
        newScore1 += 1;
        finalBallX = CANVAS_WIDTH / 2;
        finalBallY = CANVAS_HEIGHT / 2;
        newBallSpeedX = -Math.abs(gameState.ballSpeedX);
      }

      // Update game state
      setGameState(prev => ({
        ...prev,
        ballX: finalBallX,
        ballY: finalBallY,
        ballSpeedX: newBallSpeedX,
        ballSpeedY: newBallSpeedY,
        paddle2Y: newPaddle2Y,
        score1: newScore1,
        score2: newScore2
      }));

      // Draw the game
      draw();

      // Continue game loop
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    // Start game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, moveAIPaddle]);

  // Handle user input for moving player paddle
  useEffect(() => {
    const handleKeyDown = (e) => {
      setGameState(prev => {
        switch (e.key) {
          case 'ArrowUp':
            return {
              ...prev,
              paddle1Y: Math.max(0, prev.paddle1Y - PADDLE_SPEED)
            };
          case 'ArrowDown':
            return {
              ...prev,
              paddle1Y: Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, prev.paddle1Y + PADDLE_SPEED)
            };
          default:
            return prev;
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toggle code view
  const toggleCodeView = () => {
    setShowCode(!showCode);
  };

  // Apply code changes
  const applyCodeChanges = () => {
    try {
      // Create a safe execution context with necessary game state and functions
      const safeContext = {
        setGameState
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

  // Get AI suggestion
  // const getAiSuggestion = async () => {
  //   if (!aiPrompt.trim()) return;
  
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.post('/api/pingpong', {
  //       prompt: `Modify the initGame function to: ${aiPrompt}
  
  //       Provide ONLY the function body. Do not include function declaration, code blocks, or any markdown. 
  //       Use the following parameters if needed: setGameState.
        
  //       Example output format (no code fences or extra text):
  //       const defaultGameState = {
  //         paddle1Y: 200,
  //         paddle2Y: 200,
  //         ballX: 300,
  //         ballY: 200,
  //         ballSpeedX: 5,
  //         ballSpeedY: 5,
  //         score1: 0,
  //         score2: 0,
  //         difficulty: 0.7
  //       };
  //       setGameState(defaultGameState);`,
  //       model: 'gpt-4o'
  //     });
  
  //     const suggestion = response.data.suggestion;
      
  //     // Replace the entire editableCode with a new implementation
  //     setEditableCode(`const initGame = () => {
  //   ${suggestion.trim()}
  // };`);
  
  //     setIsLoading(false);
  //     alert('AI suggestion applied. Apply changes to test.');
  //   } catch (error) {
  //     console.error('Error getting AI suggestion:', error);
  //     alert('Failed to get AI suggestion. Please try again.');
  //     setIsLoading(false);
  //   }
  // };


  // AI Suggestion method with improved error handling
  const getAiSuggestion = async () => {
    if (!aiPrompt.trim()) {
      alert('Please enter a prompt for AI suggestion');
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await axios.post('/api/pingpong', {
        prompt: `Modify the initGame function to: ${aiPrompt}
        
        Provide ONLY the function body. Do not include function declaration, code blocks, or any markdown. 
        Example output format (no code fences or extra text):
       
        const defaultGameState = {
           paddle1Y: 200,
           paddle2Y: 200,
           ballX: 300,
           ballY: 200,
           ballSpeedX: 5,
           ballSpeedY: 5,
           score1: 0,
           score2: 0,
           difficulty: 0.7
        };
      setGameState(defaultGameState);
       `,
        model: 'gpt-4o'
      });
  
      const suggestion = response.data.suggestion;
      
      setEditableCode(`const initGame = () => {
  ${suggestion.trim()}
};`);
  
      alert('AI suggestion applied. Apply changes to test.');
    } catch (error) {
      console.error('Detailed AI Suggestion Error:', error);
      alert(`Failed to get AI suggestion: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 flex items-center justify-center gap-4">
          <Play className="text-gray-600" />
          Ping Pong Game (Player vs AI)
          <Code className="text-gray-600" />
        </h1>

        <div className="flex space-x-6">
          {/* Game Container */}
          <div className={`${showCode ? 'w-1/2' : 'w-full'} bg-white shadow-xl rounded-lg p-6 transition-all duration-300`}>
            <div className="flex flex-col items-center">
              <canvas 
                ref={canvasRef} 
                width={CANVAS_WIDTH} 
                height={CANVAS_HEIGHT} 
                className="border-4 border-gray-500 rounded-md shadow-md bg-black"
              ></canvas>
              
              <div className="mt-4 flex items-center space-x-4">
                <p className="text-xl font-semibold">Scores: 
                  <span className="text-gray-600 ml-2">{gameState.score1} - {gameState.score2}</span>
                </p>

                <Button 
                  onClick={defaultInitGame}
                  variant="outline"
                  className="bg-black text-white hover:bg-gray-300"
                >
                  Restart Game
                </Button>

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

export default PingPongGame;