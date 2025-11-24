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
    if (!newNote.title || !newNote.content) {
      alert("Title and Content are required");
      return;
    }
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
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        {userContext?.user?.username}
      </h2>

      {/* Title input */}
      <input
        type="text"
        placeholder="Title"
        value={newNote.title}
        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Content textarea */}
      <textarea
        placeholder="Content"
        value={newNote.content}
        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
        className="w-full p-3 h-32 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Add / Update button */}
      <button
        onClick={handleCreateOrUpdate}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
      >
        {editingIndex !== null ? "Update Note" : "Add Note"}
      </button>

      {/* Notes list */}
      <div className="space-y-4">
        {notes.map((note, index) => {
          const [title, ...contentParts] = note.split(": ");
          const content = contentParts.join(": ");

          return (
            <div
              key={index}
              className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white"
            >
              <p className="text-gray-800 whitespace-pre-line">
                <span className="font-semibold">{title}</span>: {content}
              </p>

              <div className="mt-3 flex items-center gap-3">
                {/* Edit */}
                <button
                  onClick={() => {
                    setEditingIndex(index);
                    setNewNote({ title, content });
                  }}
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
                >
                  Edit
                </button>

                {/* Cancel (only for the currently editing note) */}
                {editingIndex === index && (
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
