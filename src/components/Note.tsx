import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../AuthContext";

export default function Note() {
  const userContext = useUser();
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const nav = useNavigate();
  useEffect(() => {
    const storedNotes = localStorage.getItem(
      `notes_${userContext?.user?.username}`
    );
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, [userContext?.user?.username]);

  const saveNotes = (updatedNotes: string[]) => {
    setNotes(updatedNotes);
    localStorage.setItem(
      `notes_${userContext?.user?.username}`,
      JSON.stringify(updatedNotes)
    );
  };

  const handleCreateOrUpdate = () => {
    const formatted = `${newNote.title}: ${newNote.content}`;

    if (editingIndex !== null) {
      const updatedNotes = [...notes];
      updatedNotes[editingIndex] = formatted;
      saveNotes(updatedNotes);
      setEditingIndex(null);
    } else {
      saveNotes([...notes, formatted]);
    }

    setNewNote({ title: "", content: "" });
  };

  return (
    <div>
      <h2>{userContext?.user?.username}</h2>

      <input
        type="text"
        placeholder="Title"
        value={newNote.title}
        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
      />

      <textarea
        placeholder="Content"
        value={newNote.content}
        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
      />

      <button onClick={handleCreateOrUpdate}>
        {editingIndex !== null ? "Update Note" : "Add Note"}
      </button>

      <div>
        {notes.map((note, index) => (
          <div key={index} className="note">
            <p>{note}</p>

            <button
              onClick={() => {
                setEditingIndex(index);

                const [title, ...contentParts] = note.split(": ");
                const content = contentParts.join(": ");

                setNewNote({ title, content });
              }}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
