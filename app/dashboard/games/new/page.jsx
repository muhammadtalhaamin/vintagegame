'use client';

import { useState } from 'react';
import axios from 'axios';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Code, Play, Wand2, Star, Edit } from 'lucide-react';

export default function NewGamePage() {
  const [gameRequest, setGameRequest] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gameComponent, setGameComponent] = useState(null);
  const [error, setError] = useState(null);
  const [isGameGenerated, setIsGameGenerated] = useState(false);

  const generateGameCode = async () => {
    // Reset previous state
    setError(null);
    setGameComponent(null);
    setGeneratedCode('');
    setIsGameGenerated(false);

    // Validate input
    if (!gameRequest.trim()) {
      setError('Please provide a game description');
      return;
    }

    setIsLoading(true);
    try {
      // Make API call to generate game
      const response = await axios.post('/api/new', { prompt: gameRequest }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 60000
      });

      // Validate response
      if (!response.data || !response.data.code) {
        throw new Error('Invalid response from server');
      }

      const generatedCodeResponse = response.data.code;
      console.log('Raw generated code:', generatedCodeResponse);

      // Create a more aggressive sanitization function
      const sanitizeCode = (code) => {
        // Remove all import statements
        code = code.replace(/import\s+.*?from\s*['"].*?['"];?/g, '');
        
        // Remove export keywords
        code = code.replace(/export\s+(default\s+)?/g, '');
        
        // Wrap the code in a function declaration if not already
        if (!code.includes('function GameComponent')) {
          code = `function GameComponent() { 
            ${code} 
          }`;
        }
        
        return code;
      };

      // Sanitize the code
      const sanitizedCode = sanitizeCode(generatedCodeResponse);
      console.log('Sanitized code:', sanitizedCode);

      setGeneratedCode(sanitizedCode);
      setIsGameGenerated(true);
    } catch (error) {
      console.error('Full error:', error);
      
      let errorMessage = 'Failed to generate game';
      
      // Detailed error handling
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = `Server error: ${error.response.status} - ${error.response.data?.error || 'Unknown server error'}`;
        } else if (error.request) {
          errorMessage = 'No response received from server';
        } else {
          errorMessage = `Request setup error: ${error.message}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const startGame = () => {
    try {
      // Use Function constructor with explicit React parameter
      const createComponent = new Function('React', `
        return (function() {
          try {
            ${generatedCode}
            
            // Ensure GameComponent is a valid React component
            if (typeof GameComponent !== 'function') {
              throw new Error('GameComponent is not a valid React component');
            }
            
            return GameComponent;
          } catch (error) {
            console.error('Component creation error:', error);
            throw error;
          }
        })();
      `);

      const GameComponent = createComponent(React);

      // Wrap in error boundary
      const SafeGameComponent = () => (
        <ErrorBoundary>
          <GameComponent />
        </ErrorBoundary>
      );

      setGameComponent(<SafeGameComponent />);
    } catch (error) {
      console.error('Error starting game:', error);
      setError('Failed to start the game. Please check the generated code.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 flex items-center justify-center gap-4">
          <Play className="text-green-600" />
          Game Generator
          <Code className="text-blue-600" />
        </h1>

        <div className="flex space-x-6">
          {/* Game Request Input */}
          <div className="w-1/2 bg-white shadow-xl rounded-lg p-6">
            <Card className="w-full h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="text-blue-600" />
                  Generate Game
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={gameRequest}
                  onChange={(e) => setGameRequest(e.target.value)}
                  className="w-full h-[350px] font-mono text-sm bg-gray-50 border-2 border-blue-100"
                  placeholder="Describe the game you want to create (e.g., 'A simple tic-tac-toe game' or 'Memory card matching game')"
                />
                <Button
                  onClick={generateGameCode}
                  disabled={isLoading}
                  className="mt-4 w-full"
                >
                  {isLoading ? 'Generating...' : 'Generate Game'}
                </Button>
                {error && (
                  <div className="text-red-500 mt-2 text-sm">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Generated Game and Code Display */}
          <div className="w-1/2 bg-white shadow-xl rounded-lg p-6">
            <Card className="w-full h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="text-blue-600" />
                  Generated Game
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-4 border-green-500 rounded-md shadow-md p-4 min-h-[400px]">
                  {gameComponent || (
                    <p className="text-gray-500 text-center">
                      Generated game will appear here
                    </p>
                  )}
                </div>
                
                {isGameGenerated && (
                  <div className="flex space-x-2 mt-4">
                    <Button
                      onClick={startGame}
                      className="flex-1"
                    >
                      <Star className="mr-2" /> Start Game
                    </Button>
                  </div>
                )}

                <Textarea
                  value={generatedCode}
                  onChange={(e) => setGeneratedCode(e.target.value)}
                  className="w-full h-[350px] font-mono text-sm bg-gray-50 border-2 border-blue-100 mt-4"
                  placeholder="Generated code will appear here"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Standard React error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 p-4 text-center">
          Error rendering game component. Please check the generated code.
        </div>
      );
    }
    return this.props.children;
  }
}