import React from 'react';

// Material Community Icons için basit mock
const MaterialCommunityIcon = ({ name, size = 24, color = '#000', style, ...props }) => {
  // Icon ismine göre basit emoji/simge döndür
  const getIcon = (iconName) => {
    const iconMap = {
      'home': '🏠',
      'search': '🔍',
      'heart': '❤️',
      'star': '⭐',
      'menu': '☰',
      'close': '✕',
      'check': '✓',
      'arrow-left': '←',
      'arrow-right': '→',
      'plus': '+',
      'minus': '-',
      'shopping': '🛒',
      'cart': '🛒',
      'account': '👤',
      'settings': '⚙️',
    };
    return iconMap[iconName] || '●';
  };

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
  }, getIcon(name));
};

export default MaterialCommunityIcon; 