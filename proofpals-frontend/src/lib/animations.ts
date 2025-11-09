// Animation utilities for ProofPals
export const animations = {
  // Entrance animations
  fadeIn: "animate-in fade-in duration-500",
  slideInFromLeft: "animate-in slide-in-from-left-4 duration-500",
  slideInFromRight: "animate-in slide-in-from-right-4 duration-500",
  slideInFromTop: "animate-in slide-in-from-top-4 duration-500",
  slideInFromBottom: "animate-in slide-in-from-bottom-4 duration-500",
  scaleIn: "animate-in zoom-in-95 duration-300",
  
  // Hover animations
  hoverScale: "hover:scale-105 transition-transform duration-200",
  hoverLift: "hover:-translate-y-1 hover:shadow-lg transition-all duration-200",
  hoverGlow: "hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300",
  
  // Loading animations
  pulse: "animate-pulse",
  spin: "animate-spin",
  bounce: "animate-bounce",
  
  // Stagger animations (for lists)
  stagger: (index: number) => `animate-in fade-in slide-in-from-bottom-4 duration-500 delay-${Math.min(index * 100, 500)}`,
  
  // Interactive animations
  buttonPress: "active:scale-95 transition-transform duration-100",
  cardHover: "hover:shadow-xl hover:shadow-gray-900/10 hover:-translate-y-0.5 transition-all duration-300",
  
  // Gradient animations
  gradientShift: "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-size-200 animate-gradient-x",
  
  // Floating animations
  float: "animate-float",
  floatDelay: "animate-float-delay",
  
  // Shimmer effect
  shimmer: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
};

// Custom keyframes for Tailwind config
export const customKeyframes = {
  'gradient-x': {
    '0%, 100%': {
      'background-size': '200% 200%',
      'background-position': 'left center'
    },
    '50%': {
      'background-size': '200% 200%',
      'background-position': 'right center'
    }
  },
  'float': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-10px)' }
  },
  'float-delay': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-8px)' }
  },
  'shimmer': {
    '100%': { transform: 'translateX(100%)' }
  },
  'glow': {
    '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
    '50%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)' }
  }
};

// Animation presets for common components
export const componentAnimations = {
  card: "animate-in fade-in slide-in-from-bottom-4 duration-500 hover:shadow-xl hover:-translate-y-0.5 transition-all",
  button: "hover:scale-105 active:scale-95 transition-transform duration-200",
  modal: "animate-in fade-in zoom-in-95 duration-300",
  sidebar: "animate-in slide-in-from-left-6 duration-400",
  header: "animate-in slide-in-from-top-4 duration-400",
  list: "space-y-2 [&>*]:animate-in [&>*]:fade-in [&>*]:slide-in-from-left-4 [&>*]:duration-500",
};
