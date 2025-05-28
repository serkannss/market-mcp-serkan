import React from 'react';

// Material Icons için basit mock
const MaterialIcon = ({ name, size = 24, color = '#000', style, ...props }) => {
  return React.createElement('span', {
    style: {
      fontSize: size,
      color: color,
      fontFamily: 'Arial, sans-serif',
      display: 'inline-block',
      width: size,
      height: size,
      textAlign: 'center',
      lineHeight: `${size}px`,
      ...style
    },
    ...props
  }, '●'); // Basit nokta simgesi
};

export default MaterialIcon; 