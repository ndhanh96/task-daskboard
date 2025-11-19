import { Button } from "antd";
import { useRouter } from "next/navigation";
import { deleteTask } from "@/lib/db";
import { useTransition } from "react";

function DeleteTask({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await deleteTask(id);
        router.refresh();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    });
  };
  return (
    <Button loading={isPending} onClick={handleDelete} danger>
      Delete
    </Button>
  );
}
export default DeleteTask;
