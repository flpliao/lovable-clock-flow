
import React from 'react';

const ApolloLogo: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/7b238701-8df5-4a06-9559-6e080e1567c9.png" 
          alt="Sharing Logo" 
          className="h-24 text-apollo-blue" // Changed from h-16 to h-24 (increasing size by 50%)
        />
      </div>
    </div>
  );
};

export default ApolloLogo;
