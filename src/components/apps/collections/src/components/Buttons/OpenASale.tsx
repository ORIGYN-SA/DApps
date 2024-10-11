const OpenASale = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="bg-charcoal text-white px-5 py-1 text-center text-sm font-semibold rounded-full hover:scale-105 transition-transform duration-100"
  >
    + Open a sale
  </button>
);

export default OpenASale;
