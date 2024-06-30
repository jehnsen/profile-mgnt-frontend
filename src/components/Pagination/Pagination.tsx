import React from 'react';
import ArrowLeftIcon from '../ui/ArrowLeftIcon';
import ArrowRightIcon from '../ui/ArrowRightIcon';
interface PaginationProps {
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, setCurrentPage }) => {
    const maxPageNumbersToShow = 5;
    const halfPageNumbersToShow = Math.floor(maxPageNumbersToShow / 2);

    let startPage = Math.max(1, currentPage - halfPageNumbersToShow);
    let endPage = Math.min(totalPages, currentPage + halfPageNumbersToShow);

    if (currentPage <= halfPageNumbersToShow) {
        endPage = Math.min(totalPages, maxPageNumbersToShow);
    } else if (currentPage + halfPageNumbersToShow >= totalPages) {
        startPage = Math.max(1, totalPages - maxPageNumbersToShow + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="mt-4 flex justify-center">
            <button
                className={`mx-1 px-3 py-1 border rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-gray-200'}`}
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ArrowLeftIcon />
            </button>
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`mx-1 px-3 py-1 border rounded ${currentPage === number ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
                >
                    {number}
                </button>
            ))}
            <button
                className={`mx-1 px-3 py-1 border rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-500' : 'bg-gray-200'}`}
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ArrowRightIcon />
            </button>
        </div>
    );
};

export default React.memo(Pagination);
