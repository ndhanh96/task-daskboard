import { getAllTasks } from "@/lib/db";
import App from "@/components/App";

export default async function Home() {
  const myTasks = await getAllTasks();

  return <App myTasks={myTasks} />;
}
