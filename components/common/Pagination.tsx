import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PageButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...props }) => {
    const baseClasses = `relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md transition-colors`;
    const enabledClasses = `bg-gray-800 text-gray-300 hover:bg-gray-700`;
    const disabledClasses = `bg-gray-800/50 text-gray-500 cursor-not-allowed`;
    
    return (
        <button
            type="button"
            className={`${baseClasses} ${props.disabled ? disabledClasses : enabledClasses} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};


export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="bg-gray-800/50 border-t border-gray-700 px-4 py-3 flex items-center justify-between sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <PageButton onClick={handlePrev} disabled={currentPage === 1}>
          Previous
        </PageButton>
        <PageButton onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </PageButton>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-400">
            Page <span className="font-medium text-white">{currentPage}</span> of <span className="font-medium text-white">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <PageButton onClick={handlePrev} disabled={currentPage === 1} className="rounded-r-none">
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </PageButton>
            <PageButton onClick={handleNext} disabled={currentPage === totalPages} className="rounded-l-none">
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            </PageButton>
          </nav>
        </div>
      </div>
    </div>
  );
};
