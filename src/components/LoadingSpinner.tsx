type Size = 'sm' | 'md' | 'lg';

type LoadingSpinnerProps = {
  size?: Size;
  className?: string;
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${SIZE_CLASSES[size]} animate-spin rounded-full border-2 border-card-border border-t-accent`}
      />
    </div>
  );
}
