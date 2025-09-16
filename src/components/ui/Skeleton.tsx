import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave';
}

const Skeleton = ({ 
  className = '', 
  variant = 'rectangular', 
  width, 
  height, 
  animation = 'pulse' 
}: SkeletonProps) => {
  const baseClasses = 'bg-gray-200 rounded';
  
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse'
  };

  const style = {
    width: width || '100%',
    height: height || '1rem'
  };

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );
};

// Componentes pré-definidos
export const SkeletonCard = () => (
  <div className="card p-6">
    <Skeleton variant="rectangular" height="200px" className="mb-4" />
    <Skeleton variant="text" width="80%" className="mb-2" />
    <Skeleton variant="text" width="60%" className="mb-2" />
    <Skeleton variant="text" width="40%" />
  </div>
);

export const SkeletonTestimonial = () => (
  <div className="card p-8 text-center min-h-[400px] flex flex-col justify-center">
    <div className="flex justify-center mb-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} variant="circular" width="20px" height="20px" className="mx-1" />
      ))}
    </div>
    <Skeleton variant="text" height="24px" className="mb-4" />
    <Skeleton variant="text" width="90%" className="mb-2" />
    <Skeleton variant="text" width="80%" className="mb-2" />
    <Skeleton variant="text" width="70%" className="mb-6" />
    <Skeleton variant="text" width="40%" height="20px" />
  </div>
);

export const SkeletonHero = () => (
  <div className="relative min-h-screen flex items-center justify-center">
    <div className="absolute inset-0 bg-gray-200" />
    <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
      <Skeleton variant="text" height="80px" width="90%" className="mb-6 mx-auto" />
      <Skeleton variant="text" height="32px" width="70%" className="mb-8 mx-auto" />
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
        <Skeleton variant="rectangular" width="200px" height="48px" />
        <Skeleton variant="rectangular" width="200px" height="48px" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="text-center">
            <Skeleton variant="text" height="40px" className="mb-2" />
            <Skeleton variant="text" width="80%" className="mx-auto" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Skeleton;

