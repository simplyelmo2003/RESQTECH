import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', ...props }) => {
  return (
    <div
      className={`bg-gradient-to-br from-white via-brand-white to-gray-50 backdrop-blur-sm border border-brand-navy/10 shadow-lg rounded-3xl p-6 transform transition-all duration-300 hover:shadow-2xl hover:border-brand-teal/30 hover:-translate-y-2 ${className} fade-in-up`}
      {...props}
    >
      {title && (
        <div className="border-b-2 border-gradient-to-r from-brand-navy via-transparent to-brand-teal pb-3 mb-4">
          <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-brand-navy to-brand-teal bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;