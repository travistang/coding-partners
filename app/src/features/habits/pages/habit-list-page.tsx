import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { CreateHabitModal } from "../components/create-habit-modal";
import { HabitList } from "../components/habit-list";
import { HabitService } from "../services/habit-service";

const HabitListPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const {
    data: habits = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["habits"],
    queryFn: HabitService.getAll,
  });

  const { mutate: createHabit } = useMutation({
    mutationFn: HabitService.create,
    onSuccess: () => {
      refetch();
      setShowModal(false);
    },
    onError: (error: unknown) => {
      console.error("Failed to create habit:", error);
    },
  });

  const { mutate: toggleHabitCompletion } = useMutation({
    mutationFn: HabitService.toggleComplete,
    onSuccess: () => {
      refetch();
    },
    onError: (error: unknown) => {
      console.error("Failed to toggle habit completion:", error);
    },
  });
  return (
    <div>
      <div className="h-16 shrink-0 sticky top-0 flex items-center justify-between p-4">
        <span className="text-lg font-semibold">Habit List</span>
        <button onClick={() => setShowModal(true)} className="primary">
          Create habit
        </button>
      </div>
      <HabitList
        onToggle={toggleHabitCompletion}
        habits={habits}
        loading={isLoading}
        errored={isError}
      />
      <CreateHabitModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreate={createHabit}
      />
    </div>
  );
};

export default HabitListPage;
