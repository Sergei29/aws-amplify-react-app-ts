import React, { useState } from "react";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import useNotes from "./hooks/useNotes";
import "./App.css";

export type FormStateType = Readonly<{ name: string; description: string }>;
type InputChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;
const initialFormState: FormStateType = { name: "", description: "" };

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormStateType>(initialFormState);
  const { notes, createNote, deleteNote } = useNotes();

  const handleChange = (objEvent: InputChangeEvent) => {
    const { name, value } = objEvent.target;
    setFormData((prevState) => ({
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
          <div className="noteForm__buttonGroup">
            <button type="submit">submit</button>
            <button type="reset" onClick={handleResetForm}>
              reset
            </button>
          </div>
        </form>
        <div className="notesList">
          {notes.map((objNote) => (
            <div
              key={objNote.id || objNote.name}
              className="notesList__noteItem"
            >
              <h4>{objNote.name}</h4>
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
