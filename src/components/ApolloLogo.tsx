
import React from 'react';
import { Link } from 'react-router-dom';

const ApolloLogo: React.FC = () => {
  return (
    <div className="flex items-center">
      <Link to="/" className="cursor-pointer">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/7b238701-8df5-4a06-9559-6e080e1567c9.png" 
            alt="Sharing Logo" 
            className="h-16 text-[#003366]" // Changed from h-12 to h-16 (slightly larger but still compact)
          />
        </div>
      </Link>
    </div>
  );
};

export default ApolloLogo;
