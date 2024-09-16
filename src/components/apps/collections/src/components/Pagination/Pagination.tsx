import React from 'react';

interface PaginationProps {
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  itemsPerPage,
  totalPages,
  currentPage,
  paginate,
}) => {
  // Function to render page numbers with ellipses
  const renderPageNumbers = (): JSX.Element => {
    const pagesToShow: number[] = [];
    const maxPageNumbersToShow = 5;
    const halfWay = Math.floor(maxPageNumbersToShow / 2);
    let startPage = currentPage - halfWay;
    let endPage = currentPage + halfWay;

    if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(maxPageNumbersToShow, totalPages);
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, totalPages - maxPageNumbersToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pagesToShow.push(i);
    }

    return (
      <>
        {startPage > 1 && (
          <>
            <button
              onClick={() => paginate(1)}
              className={`px-2 py-1 mx-1 ${currentPage === 1 ? 'bg-[#F1F6F9] rounded-full px-3 font-bold' : 'text-gray-700'}`}
            >
              1
            </button>
            {startPage > 2 && <span className="mx-1">...</span>}
          </>
        )}
        {pagesToShow.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-2 py-1 mx-1 ${currentPage === number ? 'bg-[#F1F6F9] rounded-full px-3 font-bold' : 'text-gray-700'}`}
          >
            {number}
          </button>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="mx-1">...</span>}
            <button
              onClick={() => paginate(totalPages)}
              className={`px-2 py-1 mx-1 ${currentPage === totalPages ? 'bg-[#F1F6F9] rounded-full px-3 font-bold' : 'text-gray-700'}`}
            >
              {totalPages}
            </button>
          </>
        )}
      </>
    );
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={() => paginate(Math.max(currentPage - 1, 1))}
        className="px-3 py-1 mx-1 text-gray-700"
        disabled={currentPage === 1}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
        className="px-3 py-1 mx-1 text-gray-700"
        disabled={currentPage === totalPages}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
