"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, StickyNote, Loader2, Pencil, Trash } from "lucide-react";
import axios from "axios";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import LoadingPage from "../../components/LoadingPage";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { getUser } = useKindeBrowserClient();
  const alsoUser = getUser();

  const [notes, setNotes] = useState<
    { id: string; title: string; content: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editingNote, setEditingNote] = useState<boolean | string>(false);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!alsoUser?.id) return;
      try {
        const response = await axios.get(`/api/notes/${alsoUser.id}`);
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [alsoUser?.id]);

  const handleSaveNote = async () => {
    setIsSaving(true);
    if (!title.trim() || !content.trim()) return;
    try {
      if (editingNote) {
        // Update the note
        const response = await axios.put(`/api/notes/${editingNote}`, {
          title,
          content,
        });
        const updatedNote = response.data;
        setNotes(
          notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
        );
      } else {
        const response = await axios.post("/api/notes", {
          userId: alsoUser?.id,
          title,
          content,
        });
        console.log(response?.data?.message);
        setNotes([...notes, response.data?.message]);
      }
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setTitle("");
      setContent("");
      setIsModalOpen(false);
      setIsSaving(false);
      setEditingNote(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      await axios.delete(`/api/notes/${noteId}`);
      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleEdit = async (noteId: string) => {
    const note = notes.find((note) => note.id === noteId);
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setEditingNote(noteId);
    setIsModalOpen(true);
  };
  if (loading) return <LoadingPage />;

  return (
    <div className="min-h-screen w-full dark:bg-gray-800 p-6 text-black dark:text-white">
      {/* Title and description */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Your Notes
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Create and manage notes effortlessly.
        </p>
      </div>

      {/* Add New Note Button */}
      <div className="mt-4 flex flex-row-reverse">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Note
        </Button>
      </div>

      {/* Empty State */}
      {notes.length === 0 && (
        <div className="mt-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <StickyNote size={50} className="text-gray-400 mx-auto" />
            <h2 className="text-xl font-semibold mt-2">No Notes Yet</h2>
            <p className="text-gray-400">Start by creating a new note.</p>
            <Button onClick={() => setIsModalOpen(true)} className="mt-4">
              Create New Note
            </Button>
          </motion.div>
        </div>
      )}

      {/* Notes List */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <motion.div
            key={note.id}
            className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md relative transition-all hover:shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Note Title & Content */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {note.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{note.content}</p>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-3">
              {/* Edit Button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-blue-500 hover:text-blue-600"
                onClick={() => handleEdit(note.id)}
              >
                <Pencil className="w-5 h-5" />
              </Button>

              {/* Delete Button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600"
                onClick={() => handleDelete(note.id)}
              >
                <Trash className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for Adding Notes */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <motion.div
            className="p-8 rounded-xl w-full max-w-lg shadow-lg transition-all
                bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Create New Note</h2>

            {/* Title Input */}
            <input
              type="text"
              className="w-full p-3 rounded-lg outline-none border
                  bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
              placeholder="Enter title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Content Textarea */}
            <textarea
              className="w-full p-3 mt-3 rounded-lg outline-none border
                  bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white resize-none"
              placeholder="Enter note content..."
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Characters: {content.length}
            </p>

            {/* Buttons */}
            <div className="flex justify-end mt-6 gap-3">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-gray-500 text-gray-900 dark:text-white dark:border-gray-400 "
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveNote}
                disabled={!title.trim() || !content.trim() || isSaving}
              >
                {!isSaving ? (
                  "Save Note"
                ) : (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
