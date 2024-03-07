import { useState } from "react";
import "@picocss/pico";
import "./App.css";

function App() {
  return (
    <main className="container">
      <h1 className="app-title">My notes</h1>

      <div className="note-list">
        <article className="note-item">
          <div>Note 1</div>
        </article>

        <article className="note-item">
          <div>Note 2</div>
        </article>
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
          />
          <button type="button">Save</button>
        </label>
      </div>
    </main>
  );
}

export default App;
