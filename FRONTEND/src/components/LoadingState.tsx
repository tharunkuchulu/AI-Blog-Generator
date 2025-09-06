import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Thinking...",
  "Weaving words...",
  "Almost ready..."
];

const LoadingState: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto text-center py-16">
      <div className="space-y-8">
        <div className="relative">
          <div className="gradient-bg w-16 h-16 mx-auto rounded-full animate-spin opacity-20"></div>
          <div className="gradient-bg w-12 h-12 mx-auto rounded-full animate-ping absolute top-2 left-1/2 transform -translate-x-1/2"></div>
        </div>
        
        <div className="space-y-4">
          <p className="text-2xl font-medium gradient-text animate-pulse">
            {loadingMessages[currentMessage]}
          </p>
          
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full gradient-bg loading-dots"
                style={{ animationDelay: `${i * 0.3}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;