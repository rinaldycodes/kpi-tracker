import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  primary: '#007bff',
  secondary: '#6c757d',
  edit: '#17a2b8',
  danger: '#dc3545',
  error: '#e74c3c',
  info: '#00bcd4',
  white: '#ffffff',
  disabled: '#cccccc',
  success: '#28a745',
};

const MyButton = ({
  variant = 'solid',
  color = 'primary',
  onPress,
  children,
  style,
  textStyle,
  disabled = false,
}) => {
  const bgColor = COLORS[color] || COLORS.primary;
  const borderColor = bgColor;
  const textColor = disabled
  ? '#888'
  : variant === 'outline'
  ? bgColor
  : COLORS.white;

  const baseButtonStyle = [
    styles.buttonBase,
    variant === 'solid' && {
      backgroundColor: disabled ? COLORS.disabled : bgColor,
    },
    variant === 'outline' && {
      borderColor: disabled ? COLORS.disabled : borderColor,
      borderWidth: 2,
      backgroundColor: 'transparent',
    },
    disabled && styles.disabled,
    style,
  ];

  const baseTextStyle = [
    styles.textBase,
    { color: disabled ? '#888' : textColor },
    textStyle,
  ];

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        activeOpacity={0.8}
        style={[styles.buttonBase, style]}>
        <LinearGradient
          colors={
            disabled
              ? [COLORS.disabled, COLORS.disabled]
              : [bgColor, `${bgColor}CC`]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill} // ✅ gradient full fill di bawah
        />
        <Text style={baseTextStyle}>{children}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={baseButtonStyle}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}>
      <Text style={baseTextStyle}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gradientInner: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  textBase: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default MyButton;
