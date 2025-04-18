import { HabitWithCompletion } from "../types";

type Props = {
  habits: HabitWithCompletion[];
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
            <li key={habit.id}>
              <div className="flex justify-between items-center">
                <div className="flex flex-col flex-1">
                  <h2 className="text-lg font-bold">{habit.name}</h2>
                  <p className="text-sm">{habit.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={habit.completed}
                    onClick={() => onToggle(habit.id)}
                  />
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => onDelete(habit.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
