/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "@picocss/pico";
import "./App.css";

// pure component without side effects
// - render part of note
// - control the edit/delete UI (not logic)
function NoteWidget({ note, editing, onEditNote, onDeleteNote }) {
  const [deletingItem, setDeletingItem] = useState(null);
  return (
    <article
      className={`note-item ${editing ? "note-editing" : ""}`}
      key={note.id}
    >
      <div className="note-title">{note.title}</div>
      <button
        className="note-edit-button"
        onClick={(event) => onEditNote?.(event)}
      >
        ✍️
      </button>
      <button
        className="note-delete-button"
        onClick={() => setDeletingItem(note)}
      >
        🗑️
      </button>
      {deletingItem && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="modal-title">Are you sure?</h2>
            <p>
              To delete {'"'}
              {deletingItem.title}
              {'"'} note, click submit button below
            </p>
            <div className="modal-actions">
              <button
                onClick={(event) => {
                  setDeletingItem(null);
                  onDeleteNote?.(event);
                }}
              >
                Submit
              </button>
              <button onClick={() => setDeletingItem(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function App() {
  const [noteData, setNoteData] = useState({ title: "", content: "" });
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      return JSON.parse(savedNotes);
    }
    return [];
  });
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    const handleStorage = (event) => {
      const value = event.newValue;
      if (typeof event.key === "string" && event.key === "notes") {
        setNotes(JSON.parse(value));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  return (
    <main className="container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 className="app-title">Note App</h1>
        <button style={{ width: "auto" }}>✍️</button>
      </div>
      {/* Not recommend to refactor this part to a component, it's not flexibility when you want to change layout */}
      {/* The layout could be horizontal, vertical, or a grid */}
      {notes.length > 0 ? (
        <div className="note-list">
          {notes.map((note) => {
            return (
              <NoteWidget
                key={note.id}
                editing={note.id === noteData?.id}
                note={note}
                onEditNote={() => {
                  setNoteData(note);
                }}
                onDeleteNote={() => {
                  setNotes(notes.filter((n) => n.id !== note.id));
                }}
              />
            );
          })}
        </div>
      ) : (
        <div className="empty-notes">No notes</div>
      )}

      <br />

      <label htmlFor="note-title">
        Title
        <input
          id="note-title"
          placeholder="Title of the note"
          required
          value={noteData.title}
          onChange={(event) => {
            setNoteData((prevData) => ({
              ...prevData,
              title: event.target.value,
            }));
          }}
        />
      </label>

      <label htmlFor="note-content">
        Content
        <textarea
          placeholder="The content"
          required
          value={noteData.content}
          onChange={(event) => {
            setNoteData((prevData) => ({
              ...prevData,
              content: event.target.value,
            }));
          }}
        ></textarea>
      </label>
      {/* <button
        onClick={() => {
          if (noteData.id) {
            // update the note
            setNotes(
              notes.map((note) => {
                if (note.id === noteData.id) {
                  return noteData;
                }
                return note;
              })
            );
          } else {
            // create a new note
            setNotes([...notes, { ...noteData, id: Date.now() }]);
          }

          setNoteData({ title: "", content: "" });
        }}
      >
        Submit
      </button> */}
    </main>
  );
}

export default App;
