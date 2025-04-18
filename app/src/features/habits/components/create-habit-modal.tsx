import React, { useState } from "react";
import { CreateHabit } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (createHabit: CreateHabit) => void;
};
export const CreateHabitModal = ({ open, onClose, onCreate }: Props) => {
  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>(
    {}
  );

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; description?: string } = {};

    if (!habitName.trim()) {
      newErrors.name = "Name is required.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onCreate({ name: habitName, description: habitDescription });
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-slate-500/50 backdrop-blur-2xl flex items-center justify-center">
      <div className="bg-modal p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Create New Habit</h2>
        <form onSubmit={handleCreateHabit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="habit-name"
            >
              Name
            </label>
            <input
              id="habit-name"
              type="text"
              className="w-full border rounded px-3 py-2"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="habit-description"
            >
              Description
            </label>
            <textarea
              id="habit-description"
              className="w-full border rounded px-3 py-2"
              value={habitDescription}
              onChange={(e) => setHabitDescription(e.target.value)}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="mr-2 px-4 py-2 bg-gray-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 primary">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
