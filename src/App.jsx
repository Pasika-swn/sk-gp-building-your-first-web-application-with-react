import { useState } from "react";
import "@picocss/pico";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [notes, setNotes] = useState([]);

  return (
    <main className="container">
      <h1 className="app-title">My notes</h1>

      <div className="note-list">
        {notes.map((note, index) => (
          <article key={index} className="note-item">
            <div>{note.title}</div>
          </article>
        ))}
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="button"
            onClick={() => {
              //save the title and content to note
              setNotes([...notes, { title, content }]);
              setTitle("");
              setContent("");
            }}
          >
            Save
          </button>
        </label>
      </div>
    </main>
  );
}

export default App;
