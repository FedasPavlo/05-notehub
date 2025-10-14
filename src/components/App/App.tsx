import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '../../hooks/useDebounce';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import css from './App.module.css';

export default function App() {
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(12);
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [totalPages, setTotalPages] = useState<number>(1); 

  const queryClient = useQueryClient();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />
        {totalPages > 1 && (
          <Pagination
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        )}

        <button className={css.button} onClick={handleOpenModal}>
          Create note +
        </button>
      </header>

      <main>
        <NoteList
          page={page}
          perPage={perPage}
          search={debouncedSearch}
          onTotalPagesChange={setTotalPages}
        />
      </main>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm
            onSuccess={() => {
              queryClient.invalidateQueries({
                queryKey: ['notes', { page, perPage, search }],
              });
              handleCloseModal();
            }}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
}