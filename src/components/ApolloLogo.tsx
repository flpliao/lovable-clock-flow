
import React from 'react';

const ApolloLogo: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/7b238701-8df5-4a06-9559-6e080e1567c9.png" 
          alt="Sharing Logo" 
          className="h-24 text-[#0091D0]" // Changed from text-apollo-blue to text-[#0091D0] to match the location check-in button color
        />
      </div>
    </div>
  );
};

export default ApolloLogo;
