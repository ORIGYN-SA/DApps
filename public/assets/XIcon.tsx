interface IconProps {
  className?: string;
  onClick?: () => void;
}

const XIcon: React.FC<IconProps> = ({ className, onClick }) => (
  <svg
    className={className}
    onClick={onClick}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      d="M6 18L18 6M6 6l12 12"
    ></path>
  </svg>
);

export default XIcon;
