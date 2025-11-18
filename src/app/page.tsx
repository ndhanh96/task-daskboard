"use client";
import { Typography, Space } from "antd";
import TaskTable from "@/components/TaskTable";
import { Task } from "@/lib/tasks";
import "@ant-design/v5-patch-for-react-19";
import NewTaskModal from "@/components/NewTaskModal";
import { useEffect, useState } from "react";
import axios from "axios";

const { Title } = Typography;

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    const getTasks = async () => {
      try {
        const res = await axios.get("api/tasks");
        if (!res.statusText) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        setTasks((t) => [...t, ...res.data]);
      } catch (error) {
        throw error;
      }
    };
    getTasks();
  }, []);

  return (
    <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            My Tasks
          </Title>
          <NewTaskModal />
        </div>

        <TaskTable tasks={tasks} />
      </Space>
    </main>
  );
}
