import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import HabitListPage from "./features/habits/pages/habit-list-page";

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <HabitListPage />
    </QueryClientProvider>
  );
}

export default App;
