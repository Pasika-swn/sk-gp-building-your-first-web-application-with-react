import "@picocss/pico";

function App() {
  return (
    <main className="container" style={{ marginBlock: "1rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>Note App</h1>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          overflow: "auto",
          margin: "-1rem",
          padding: "1rem",
        }}
      >
        <article
          style={{
            margin: 0,
            borderRadius: "8px",
            border: "1px solid rgba(255 255 255 / 0.6)",
            padding: "1rem",
          }}
        >
          <div style={{ fontSize: "1.125rem", fontWeight: "bold" }}>
            My first note
          </div>
        </article>

        <article
          style={{
            margin: 0,
            borderRadius: "8px",
            border: "1px solid rgba(255 255 255 / 0.6)",
            padding: "1rem",
          }}
        >
          <div style={{ fontSize: "1.125rem", fontWeight: "bold" }}>
            My first note
          </div>
        </article>
      </div>

      <br />

      <label htmlFor="note-title">
        Title
        <input id="note-title" placeholder="Title of the note" required />
      </label>

      <label htmlFor="note-content">
        Content
        <textarea placeholder="The content" required></textarea>
      </label>
      <button>Submit</button>
    </main>
  );
}

export default App;
