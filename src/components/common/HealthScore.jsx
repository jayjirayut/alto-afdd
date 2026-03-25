import { getHealthColor } from '../../utils/helpers';

export default function HealthScore({ score, size = 'md' }) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <span className={`font-semibold tabular-nums ${sizeClasses[size]} ${getHealthColor(score)}`}>
      {score}%
    </span>
  );
}
