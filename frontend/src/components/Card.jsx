import React from 'react';

function Card({ title, value, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className={`rounded-lg shadow-md p-6 ${colorClasses[color]}`}>
      <h3 className="text-sm font-semibold text-gray-600 mb-2">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

export default Card;
