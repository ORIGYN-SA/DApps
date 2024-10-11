interface LoaderProps {
  size?: number;
}

const Loader = ({ size = 48 }: LoaderProps) => {
  return (
    <img
      src={'/assets/spinner.png'}
      alt="Loading spinner"
      className={`animate-spin`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
};

export default Loader;
