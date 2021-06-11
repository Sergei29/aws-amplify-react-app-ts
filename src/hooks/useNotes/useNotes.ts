import { useState, useEffect, useRef, useCallback } from "react";
import { API, Storage } from "aws-amplify";
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
    const notesFromAPI: Record<string, any>[] = apiData.data.listNotes.items;

    const updatedNotes = await Promise.all(
      notesFromAPI.map(async (objNote) => {
        if (objNote.image) {
          const image = await Storage.get(objNote.image);
          objNote.image = image;
        }
        return objNote;
      })
    );

    if (false === statusRef.current.willUnmount) {
      setNotes(updatedNotes);
    }
  }, []);

  const createNote = async (
    formData: FormStateType,
    funcCallbackOnSubmit: () => void
  ) => {
    if (!formData.name || !formData.description) return;
    let objFormData = { ...formData };
    await API.graphql({
      query: createNoteMutation,
      variables: { input: formData },
    });

    if (formData.image) {
      const image = await Storage.get(formData.image);
      objFormData = { ...objFormData, image: image as string };
    }

    setNotes((prevNotes) => ({
      ...prevNotes,
      ...objFormData,
    }));
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

  return { notes, createNote, deleteNote, fetchNotes };
};

export default useNotes;
