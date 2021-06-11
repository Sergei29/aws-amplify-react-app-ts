import React, { useState } from "react";
import { Storage } from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import useNotes from "./hooks/useNotes";
import "./App.css";

export type FormStateType = Readonly<{
  name: string;
  description: string;
  image: string;
}>;
type InputChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;
const initialFormState: FormStateType = {
  name: "",
  description: "",
  image: "",
};

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormStateType>(initialFormState);
  const { notes, createNote, deleteNote, fetchNotes } = useNotes();

  const handleChange = async (objEvent: InputChangeEvent) => {
    const { name, value, type } = objEvent.target;
    if ("file" === type) {
      const { files } = objEvent.target as HTMLInputElement;
      if (files && files[0]) {
        const strFilename = files[0].name;
        setFormData((prevState) => ({
          ...prevState,
          image: strFilename,
        }));
        await Storage.put(strFilename, files[0]);
        return await fetchNotes();
      }
      return;
    }
    return setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleResetForm = () => setFormData(initialFormState);

  const handleSubmt = (objEvent: React.FormEvent) => {
    objEvent.preventDefault();
    createNote(formData, handleResetForm);
  };

  return (
    <div className="App">
      <header className="App-header">
        This App is deployed to AWS Amplify
      </header>
      <main>
        <h4>My Notes App</h4>
        <form onSubmit={handleSubmt} className="noteForm">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Note name"
              onChange={handleChange}
              value={formData.name}
            />
          </div>
          <div>
            <input
              type="text"
              name="description"
              placeholder="Note description"
              onChange={handleChange}
              value={formData.description}
            />
          </div>
          <div>
            <input type="file" name="image" onChange={handleChange} />
          </div>
          <div className="noteForm__buttonGroup">
            <button type="submit">submit</button>
            <button type="reset" onClick={handleResetForm}>
              reset
            </button>
          </div>
        </form>
        <div className="notesList">
          {notes &&
            notes.map((objNote) => (
              <div
                key={objNote.id || objNote.name}
                className="notesList__noteItem"
              >
                <h4>{objNote.name}</h4>
                {objNote.image && (
                  <img src={objNote.image} style={{ width: 300 }} alt="note" />
                )}
                <p>{objNote.description}</p>

                <button onClick={() => deleteNote({ id: objNote.id })}>
                  Delete note
                </button>
              </div>
            ))}
        </div>
        <AmplifySignOut />
      </main>
    </div>
  );
};

export default withAuthenticator(App);
