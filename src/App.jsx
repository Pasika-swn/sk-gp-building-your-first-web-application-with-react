import { useState } from "react";
import "@picocss/pico";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  return (
    <main className="container">
      <h1 className="app-title">Note App</h1>
      {notes.length > 0 ? (
        <div className="note-list">
          {notes.map((note, index) => {
            return (
              <article className="note-item" key={index}>
                <div className="note-title">{note.title}</div>
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
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
      </label>

      <label htmlFor="note-content">
        Content
        <textarea
          placeholder="The content"
          required
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
          }}
        ></textarea>
      </label>
      <button
        onClick={() => {
          setNotes([...notes, { title, content }]);

          setTitle("");
          setContent("");
        }}
      >
        Submit
      </button>
    </main>
  );
}

export default App;
