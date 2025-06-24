
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
            className="h-12 sm:h-12 lg:h-16 text-[#003366] object-contain" 
          />
        </div>
      </Link>
    </div>
  );
};

export default ApolloLogo;
