import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const GradientView = ({ style, children, topColor, middleColor, bottomColor }) => {
  return (
    <LinearGradient
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={[topColor, middleColor, bottomColor]}
      style={style}
      pointerEvents="box-none"
    >
      {children}
    </LinearGradient>
  )
}

export default GradientView;
