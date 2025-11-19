"use client";
import React from "react";
import { Typography, Space } from "antd";
import TaskTable from "@/components/TaskTable";
import NewTaskModal from "@/components/NewTaskModal";
import { Task } from "@/lib/tasks";
import "@ant-design/v5-patch-for-react-19";

const { Title } = Typography;

function App({ myTasks }: { myTasks: Task[] }) {
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

        <TaskTable tasks={myTasks} />
      </Space>
    </main>
  );
}

export default App;
