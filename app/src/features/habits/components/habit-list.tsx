import { HabitWithInsights } from "../types";
import { HabitItem } from "./habit-item";

type Props = {
  habits: HabitWithInsights[];
  loading?: boolean;
  errored?: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};
export const HabitList = ({
  habits,
  loading,
  errored,
  onToggle,
  onDelete,
}: Props) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (errored) {
    return <div>Failed to load habits.</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {habits.length === 0 ? (
        <p>No habits found.</p>
      ) : (
        <ul>
          {habits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              onToggle={() => onToggle(habit.id)}
              onDelete={() => onDelete(habit.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
