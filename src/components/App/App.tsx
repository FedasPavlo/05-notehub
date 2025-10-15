import { useEffect, useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '../../hooks/useDebounce';
import { fetchNotes, type FetchNotesResponse } from '../../services/noteService';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import css from './App.module.css';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

export default function App() {
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(12);
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const previousDataRef = useRef<FetchNotesResponse | undefined>(undefined);

  const queryKey = ['notes', page, perPage, debouncedSearch] as const;

  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey,
    queryFn: () => fetchNotes({ page, perPage, search: debouncedSearch }),
    staleTime: 5_000,
    placeholderData: () => previousDataRef.current,
  });

  useEffect(() => {
    if (data) previousDataRef.current = data;
  }, [data]);

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

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
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        )}

        <button className={css.button} onClick={handleOpenModal}>
          Create note +
        </button>
      </header>

      <main>
        {isLoading && <Loader />}
        {isError && <ErrorMessage message="Error loading notes" />}
        {!isLoading && !isError && notes.length > 0 && (
          <NoteList notes={notes} />
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={() => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            handleCloseModal();
          }} />
        </Modal>
      )}
    </div>
  );
}