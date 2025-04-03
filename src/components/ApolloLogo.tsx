
import React from 'react';

const ApolloLogo: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="flex items-center">
        <svg width="60" height="35" viewBox="0 0 60 35" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.5 34C19.5 23.5 29 15 40.5 15L39 17.5C30 18.5 22.5 25.5 22.5 34H19.5Z" fill="#0091D0"/>
          <circle cx="15" cy="15" r="15" fill="#0091D0"/>
          <path d="M50 10H61L57 20.5H46.5L50 10Z" fill="#0091D0"/>
          <path d="M48 22.5H60L56 33H44L48 22.5Z" fill="#0091D0"/>
          <path d="M54 22.5L58 10" stroke="#0091D0" strokeWidth="2"/>
          <path d="M48 33L52 22.5" stroke="#0091D0" strokeWidth="2"/>
        </svg>
        <div className="ml-1 text-[#0091D0] font-bold text-2xl">pollo</div>
      </div>
      <div className="ml-1 border border-[#0091D0] text-[#0091D0] px-1 text-xs rounded">XE</div>
    </div>
  );
};

export default ApolloLogo;
