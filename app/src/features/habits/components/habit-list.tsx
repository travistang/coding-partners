import { HabitWithCompletion } from "../types";

type Props = {
  habits: HabitWithCompletion[];
  loading?: boolean;
  errored?: boolean;
  onToggle: (id: string) => void;
};
export const HabitList = ({ habits, loading, errored, onToggle }: Props) => {
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
              <div className="flex justify-between">
                <div className="flex flex-col flex-1">
                  <h2 className="text-lg font-bold">{habit.name}</h2>
                  <p className="text-sm">{habit.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={habit.completed}
                  onClick={() => onToggle(habit.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
