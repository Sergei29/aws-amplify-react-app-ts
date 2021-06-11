import { useState, useEffect, useRef, useCallback } from "react";
import { API } from "aws-amplify";
import { listNotes } from "../../graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "../../graphql/mutations";
import { FormStateType } from "../../App";

const useNotes = () => {
  const [notes, setNotes] = useState<Record<string, any>[]>([]);
  const statusRef = useRef({ willUnmount: false });

  const fetchNotes = useCallback(async () => {
    const apiData: Record<string, any> = await API.graphql({
      query: listNotes,
    });
    if (true === statusRef.current.willUnmount) {
      setNotes(apiData.data.listNotes.items);
    }
  }, []);

  const createNote = async (
    formData: FormStateType,
    funcCallbackOnSubmit: () => void
  ) => {
    if (!formData.name || !formData.description) return;
    await API.graphql({
      query: createNoteMutation,
      variables: { input: formData },
    });
    setNotes([...notes, formData]);
    funcCallbackOnSubmit();
  };

  const deleteNote = async ({ id }: { id: string }) => {
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
    const newNotesArray = notes.filter((note) => note.id !== id);
    setNotes(newNotesArray);
  };

  useEffect(() => {
    const objStatus = statusRef.current;
    fetchNotes();
    return () => {
      objStatus.willUnmount = true;
    };
  }, [fetchNotes]);

  return { notes, createNote, deleteNote };
};

export default useNotes;
