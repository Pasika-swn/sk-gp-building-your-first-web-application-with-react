/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useCallback } from "react";
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

// eslint-disable-next-line no-unused-vars
function useDebounceFn(fn, delay) {
  const timer = useRef(null);
  return (...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

// eslint-disable-next-line no-unused-vars
function useDebounceValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function App() {
  const [noteData, setNoteData] = useState(null);
  const noteDataRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
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

  const saveNotes = useCallback(
    (data) => {
      const existingNote = notes.find((note) => note.id === data.id);
      if (!existingNote) {
        setNotes([...notes, data]);
      } else {
        setNotes(
          notes.map((note) => {
            if (note.id === data.id) {
              return data;
            }
            return note;
          })
        );
      }
    },
    [notes]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "z" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        if (event.shiftKey) {
          const lastNote = future[0];
          if (lastNote) {
            setNoteData(lastNote);
            saveNotes(lastNote);
            setHistory((latestHistory) => [noteData, ...latestHistory]);
            setFuture((latestFuture) => latestFuture.slice(1));
          }
        } else {
          const previousNote = history[0];
          if (previousNote) {
            setNoteData(previousNote);
            saveNotes(previousNote);
            setHistory((latestHistory) => latestHistory.slice(1));
            setFuture((latestFuture) => [noteData, ...latestFuture]);
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [future, history, noteData, saveNotes]);

  const debouncedSaveNote = useDebounceFn((data, prevData) => {
    setHistory([prevData, ...history]);
    saveNotes(data);
    noteDataRef.current = null;
  }, 1000);

  const updateField = (field, value) => {
    if (!noteDataRef.current) {
      noteDataRef.current = noteData;
    }
    if (!noteData.id) {
      const newId = Date.now();
      setNoteData((prevData) => ({
        ...prevData,
        [field]: value,
        id: newId,
      }));
      debouncedSaveNote(
        { ...noteData, [field]: value, id: newId },
        noteDataRef.current
      );
    } else {
      setNoteData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
      debouncedSaveNote({ ...noteData, [field]: value }, noteDataRef.current);
    }
  };
  return (
    <main className="container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 className="app-title">Note App</h1>
        <button
          style={{ width: "auto" }}
          onClick={() => setNoteData({ title: "", content: "" })}
        >
          ✍️
        </button>
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

      {noteData && (
        <>
          <label htmlFor="note-title">
            Title
            <input
              autoFocus
              id="note-title"
              placeholder="Title of the note"
              required
              value={noteData.title}
              onChange={(event) => {
                updateField("title", event.target.value);
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
                updateField("content", event.target.value);
              }}
            ></textarea>
          </label>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              style={{ width: "auto" }}
              disabled={!history.length}
              onClick={() => {
                const previousNote = history[0];
                if (previousNote) {
                  setNoteData(previousNote);
                  saveNotes(previousNote);
                  setHistory((latestHistory) => latestHistory.slice(1));
                  setFuture((latestFuture) => [noteData, ...latestFuture]);
                }
              }}
            >
              Undo
            </button>
            <button
              style={{ width: "auto" }}
              disabled={!future.length}
              onClick={() => {
                const lastNote = future[0];
                if (lastNote) {
                  setNoteData(lastNote);
                  saveNotes(lastNote);
                  setHistory((latestHistory) => [noteData, ...latestHistory]);
                  setFuture((latestFuture) => latestFuture.slice(1));
                }
              }}
            >
              Redo
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default App;
