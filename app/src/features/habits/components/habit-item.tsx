import { HabitWithInsights } from "../types";

type Props = {
  habit: HabitWithInsights;
  onToggle: () => void;
  onDelete: () => void;
};
export const HabitItem = ({ habit, onToggle, onDelete }: Props) => {
  return (
    <li>
      <div className="flex justify-between items-center gap-4">
        <div className="flex gap-2 flex-1">
          <div className="flex flex-col flex-1">
            <h2 className="text-lg font-bold">{habit.name}</h2>
            <p className="text-sm">{habit.description}</p>
          </div>
          <div className="flex flex-col gap-1">
            {!!habit.streak && <span>{habit.streak} days streak!</span>}
            {habit.lastCompletedAt &&
              `Last completed at ${habit.lastCompletedAt}`}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" checked={habit.completed} onClick={onToggle} />
          <button className="text-red-500 hover:underline" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};
