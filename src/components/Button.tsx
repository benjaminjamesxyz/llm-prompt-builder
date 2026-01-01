import { ButtonVariant } from '../types';

interface ButtonProps {
  onClick: () => void;
  children: any;
  variant?: ButtonVariant;
  className?: string;
  title?: string;
}

export const Button = ({ onClick, children, variant = 'primary', className = '', title }: ButtonProps) => {
  const base = "px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-2 select-none";
  const variants = {
    primary: "bg-primary text-bg hover:bg-primaryHover",
    secondary: "bg-surface2 text-text hover:bg-surface",
    danger: "bg-surface2 text-accent hover:bg-surface hover:text-red-400",
    ghost: "bg-transparent hover:bg-surface2 text-textMuted hover:text-text"
  };
  
  return (
    <button 
      title={title} 
      className={`${base} ${variants[variant]} ${className}`} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};
