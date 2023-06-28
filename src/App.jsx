import { useState, useEffect } from "react";
import "@picocss/pico";
import "./App.css";

function App() {
  const [noteData, setNoteData] = useState({ title: "", content: "" });
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      return JSON.parse(savedNotes);
    }
    return [];
  });
  const [open, setOpen] = useState(false);
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);
  return (
    <main className="container">
      <h1 className="app-title">Note App</h1>
      {notes.length > 0 ? (
        <div className="note-list">
          {notes.map((note) => {
            return (
              <article className="note-item" key={note.id}>
                <div className="note-title">{note.title}</div>
                <button
                  className="note-edit-button"
                  onClick={() => {
                    setNoteData(note);
                  }}
                >
                  ✍️
                </button>
                <button
                  className="note-delete-button"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  🗑️
                </button>
                {open && (
                  <div className="modal">
                    <div className="modal-content">
                      <h2>Are you sure?</h2>
                      <p>To delete this note, click submit button below</p>
                      <div className="modal-actions">
                        <button
                          onClick={() =>
                            setNotes(notes.filter((n) => n.id !== note.id))
                          }
                        >
                          Submit
                        </button>
                        <button onClick={() => setOpen(false)}>Cancel</button>
                      </div>
                    </div>
                  </div>
                )}
              </article>
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
      <button
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
      </button>
    </main>
  );
}

export default App;
