import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Note } from '../../types/note';
import { deleteNote } from '../../services/noteService';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  isLoading: boolean;
  isError: boolean;
}

export default function NoteList({ notes, isLoading, isError }: NoteListProps) {
  const queryClient = useQueryClient();

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage />;

  if (notes.length === 0) return <p className={css.empty}>No notes found.</p>;

  return (
    <ul className={css.list}>
      {notes.map((note) => (
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