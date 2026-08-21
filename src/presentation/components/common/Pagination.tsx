'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        className="w-9 h-9 rounded-sm flex items-center justify-center border border-[var(--color-border)] bg-white text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--color-surface-2)]"
        style={{ color: 'var(--color-ink)' }}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <i className="fas fa-chevron-left text-[10px]"></i>
      </button>
      <span className="text-sm font-medium" style={{ color: 'var(--color-ink-muted)' }}>
        Halaman <span style={{ color: 'var(--color-ink)' }}>{currentPage}</span> dari {totalPages}
      </span>
      <button
        className="w-9 h-9 rounded-sm flex items-center justify-center border border-[var(--color-border)] bg-white text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--color-surface-2)]"
        style={{ color: 'var(--color-ink)' }}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <i className="fas fa-chevron-right text-[10px]"></i>
      </button>
    </div>
  );
};
