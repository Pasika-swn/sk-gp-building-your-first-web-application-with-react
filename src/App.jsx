import { useState } from "react";
import "@picocss/pico";
import "./App.css";

function App() {
  const [noteData, setNoteData] = useState({ title: "", content: "" });

  const [notes, setNotes] = useState([]);

  const [deletingItem, setDeletingItem] = useState(null);

  return (
    <main className="container">
      <h1 className="app-title">My notes</h1>

      <div className="note-list">
        {notes.map((note) => (
          <article
            key={note.id}
            className={`note-item ${
              note.id === noteData.id ? "note-editing" : ""
            }`}
          >
            <div>{note.title}</div>
            <button
              onClick={() => {
                setNoteData(note);
              }}
              className="note-edit-button"
            >
              ✍️
            </button>
            <button
              className="note-delete-button"
              onClick={() => {
                setDeletingItem(note);
              }}
            >
              🚮
            </button>
          </article>
        ))}
      </div>

      <div>
        {deletingItem && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-title">Are you sure?</div>
              <p>
                To delete {deletingItem.title} note, click the submit button
                below
              </p>
              <div className="modal-actions">
                <button
                  onClick={() => {
                    setNotes(
                      notes.filter((item) => deletingItem.id !== item.id)
                    );
                    setDeletingItem(null);
                  }}
                >
                  Yes
                </button>
                <button onClick={() => setDeletingItem(null)}>No</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="note-title">
        <label htmlFor="title">
          Title
          <input
            type="text"
            id="title"
            name="title"
            placeholder="The note's title"
            required
            value={noteData.title}
            onChange={(e) =>
              setNoteData({ ...noteData, title: e.target.value })
            }
          />
        </label>

        <label htmlFor="content">
          Content
          <textarea
            type="text"
            id="content"
            name="content"
            placeholder="The note's content"
            required
            value={noteData.content}
            onChange={(e) =>
              setNoteData({ ...noteData, content: e.target.value })
            }
          />
          <button
            type="button"
            onClick={() => {
              //save the title and content to note
              if (noteData.id) {
                //save to the existing note
                setNotes(
                  notes.map((item) => {
                    if (item.id === noteData.id) {
                      return noteData;
                    }
                    return item; //return ของเก่า
                  })
                );
              } else {
                //add new note to the list
                setNotes([...notes, { ...noteData, id: Date.now() }]);
              }
              setNoteData({ title: "", content: "" });
            }}
          >
            Submit
          </button>
        </label>
      </div>
    </main>
  );
}

export default App;
