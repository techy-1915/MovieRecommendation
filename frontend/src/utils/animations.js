// Page transition variants
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

// Stagger container for grids
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

// Individual grid item
export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// 3D card tilt
export const cardTilt = {
  hover: {
    scale: 1.05,
    rotateX: 5,
    rotateY: 5,
    transition: { duration: 0.3 },
  },
};

// Neon pulse animation
export const neonPulse = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(239, 68, 68, 0.5)',
      '0 0 40px rgba(239, 68, 68, 0.8)',
      '0 0 20px rgba(239, 68, 68, 0.5)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

// Fade in from bottom
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Fade in
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
};

// Scale in
export const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200 } },
};

// Confetti particle
export const confettiParticle = {
  initial: { y: -100, opacity: 1 },
  animate: {
    y: 800,
    opacity: 0,
    transition: {
      duration: 2,
      ease: 'easeIn',
    },
  },
};

// Slide in from left
export const slideInLeft = {
  initial: { x: -50, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.4 } },
};

// Slide in from right
export const slideInRight = {
  initial: { x: 50, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.4 } },
};

// Hero spotlight follow
export const spotlightVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 1 } },
};
