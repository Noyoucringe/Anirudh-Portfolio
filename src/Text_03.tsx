import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text?: string;
  className?: string;
}

function Text_03({ text = 'Hover me', className = '' }: AnimatedTextProps) {
  return (
    <motion.span
      className={`animated-text ${className}`.trim()}
      whileHover="hover"
      initial="initial"
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="animated-text-char"
          variants={{
            initial: {
              y: 0,
              scale: 1,
            },
            hover: {
              y: -4,
              scale: 1.2,
              transition: {
                type: 'spring',
                stiffness: 300,
                damping: 15,
                delay: index * 0.03,
              },
            },
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export { Text_03 };
