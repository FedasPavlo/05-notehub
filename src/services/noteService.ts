import axios, { type AxiosResponse } from 'axios';
import type { NoteTag, Note } from '../types/note';


export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}


export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

export async function fetchNotes(
    
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> {
   
  const { page = 1, perPage = 12, search = '' } = params;

  const res = await api.get('/notes', { params: { page, perPage, search } });

  return res.data;
}

export interface CreateNoteParams {
  title: string;
  content?: string;
  tag: NoteTag;
}

export async function createNote(
  payload: CreateNoteParams
): Promise<Note> {
  const res: AxiosResponse<{ data: Note }> = await api.post('/notes', payload);
  return res.data.data;
}

export async function deleteNote(id: string): Promise<{ success: boolean }> {
  const res = await api.delete(`/notes/${id}`);
  return res.data;
}
