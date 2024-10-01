const OpenASale = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="bg-charcoal text-white px-5 py-1 text-center text-sm font-semibold leading-[48px] rounded-full hover:scale-105 duration-100 transition-all"
    >
      + Open a sale
    </button>
  );
};

export default OpenASale;
