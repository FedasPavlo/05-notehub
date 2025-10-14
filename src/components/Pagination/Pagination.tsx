import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  perPage?: number;
  search?: string;
}

export default function Pagination({ page, setPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
     previousLabel="←"
    nextLabel="→"
    breakLabel="..."
      forcePage={page - 1}
      pageCount={totalPages}
      onPageChange={(event) => setPage(event.selected + 1)}
      containerClassName={css.pagination}
      activeClassName={css.active}
    />
  );
}