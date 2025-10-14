import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, deleteNote} from '../../services/noteService';
import type { Note } from '../../types/note';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import css from './NoteList.module.css';

interface NotesListProps {
  page: number;
  perPage: number;
  search: string;
  onTotalPagesChange: (pages: number) => void;
}

export default function NotesList({
  page,
  perPage,
  search,
  onTotalPagesChange,
}: NotesListProps) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', { page, perPage, search }],
    queryFn: () => fetchNotes({ page, perPage, search }),
 
  });

  const notes = data?.notes || [];
  const totalPages = data?.totalPages ?? 1;

  if (data && data.totalPages) {
    onTotalPagesChange(totalPages);
  }

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage message="Failed to load notes." />;

  if (notes.length === 0) {
    return <p className={css.empty}>No notes found.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note: Note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              disabled={isDeleting}
              onClick={() => handleDelete(note.id)}
            >
              {isDeleting ? 'Delete' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}