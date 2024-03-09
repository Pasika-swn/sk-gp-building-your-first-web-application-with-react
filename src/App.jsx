import { useState, useEffect } from "react";
import "@picocss/pico";
import "./App.css";

//dont add any logics -> just using props (ex: editing)
function NoteWidget({ note, editing, onEditNote, onDeleteNote }) {
  return (
    <article
      key={note.id}
      className={`note-item ${editing ? "note-editing" : ""}`}
    >
      <div>{note.title}</div>
      <button
        onClick={() => {
          onEditNote?.();
          //equal to -> if(onEditNote) {onEditNote()}
        }}
        className="note-edit-button"
      >
        ✍️
      </button>
      <button
        className="note-delete-button"
        onClick={() => {
          onDeleteNote?.();
        }}
      >
        🚮
      </button>
    </article>
  );
}

function App() {
  const [noteData, setNoteData] = useState(null);

  const [notes, setNotes] = useState(() => {
    return JSON.parse(localStorage.getItem("notes")) ?? [];
  });

  const [deletingItem, setDeletingItem] = useState(null);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    function handleStorageChange(event) {
      if (event.key === "notes") {
        setNotes(JSON.parse(event.newValue) ?? []);
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <main className="container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 className="app-title">Note App</h1>
        <button
          onClick={() => {
            setNoteData({ title: "", content: "" });
          }}
        >
          📝
        </button>
      </div>

      <div className="note-list">
        {notes.map((note) => {
          return (
            <NoteWidget
              note={note}
              key={note.id}
              editing={note.id === noteData?.id}
              onEditNote={() => {
                setNoteData(note);
              }}
              onDeleteNote={() => {
                setDeletingItem(note);
              }}
            />
          );
        })}
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

      {noteData && (
        <>
          <label htmlFor="title">
            Title
            <input
              type="text"
              id="title"
              name="title"
              placeholder="The note's title"
              required
              value={noteData.title}
              onChange={(event) => {
                if (noteData.id) {
                  const newData = {
                    ...noteData,
                    title: event.target.value,
                  };
                  //save to the existing note
                  setNotes(
                    notes.map((item) => {
                      if (item.id === newData.id) {
                        return newData;
                      }
                      return item; //return ของเก่า
                    })
                  );
                  setNoteData(newData);
                } else {
                  //add new note to the list
                  const newId = Date.now();
                  const newData = {
                    ...noteData,
                    title: event.target.value,
                    id: newId,
                  };
                  setNotes([...notes, newData]);
                  setNoteData(newData);
                }
              }}
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
          </label>
        </>
      )}

      {/* <div className="note-title">
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
      </div> */}
    </main>
  );
}

export default App;
