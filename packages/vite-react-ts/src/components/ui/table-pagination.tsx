import React from "react";

interface TablePaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number,
  ) => void;
  onRowsPerPageChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  rowsPerPageOptions?: number[];
  className?: string;
}

export function TablePagination({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25],
  className = "",
}: TablePaginationProps) {
  const handlePrevPage = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextPage = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    onRowsPerPageChange(
      event as unknown as React.ChangeEvent<HTMLInputElement>,
    );
  };

  const from = page * rowsPerPage + 1;
  const to = Math.min((page + 1) * rowsPerPage, count);
  const totalPages = Math.ceil(count / rowsPerPage);

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 ${className}`}
    >
      <div className="flex items-center">
        <span className="text-sm text-gray-700">每页行数:</span>
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className="ml-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <span className="text-sm text-gray-700">
          {count === 0 ? "0-0 / 0" : `${from}-${to} / ${count}`}
        </span>
        <div className="ml-4 flex">
          <button
            onClick={handlePrevPage}
            disabled={page === 0}
            className="px-2 py-1 border border-gray-300 rounded-l-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <button
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
            className="px-2 py-1 border border-gray-300 border-l-0 rounded-r-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
}