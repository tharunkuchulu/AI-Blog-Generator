import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-5xl md:text-6xl font-bold mb-8 gradient-text px-4 leading-normal overflow-visible">
        AI Blog Generator
      </h1>

      <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
        Turn your ideas into polished blogs in seconds.
      </p>
    </div>
  );
};

export default Header;