import { useState } from "react";
import "@picocss/pico";
import "./App.css";

function App() {
  const [noteData, setNoteData] = useState({title:"", content:""})

  const [notes, setNotes] = useState([]);


  return (
    <main className="container">
      <h1 className="app-title">My notes</h1>

      <div className="note-list">
        {notes.map((note, index) => (
          <article key={index} className="note-item">
            <div>{note.title}</div>
            <button onClick={()=>{
              setNoteData(note)
            }} className="note-edit-button">✍️</button>
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
            value={noteData.title}
            onChange={(e) => setNoteData({...noteData, title:e.target.value})}
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
            onChange={(e) => setNoteData({...noteData, content:e.target.value})}
          />
          <button
            type="button"
            onClick={() => {
              //save the title and content to note
              setNotes([...notes, noteData]);
              // setTitle("");
              // setContent("");
              setNoteData({title:'', content:""})
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
