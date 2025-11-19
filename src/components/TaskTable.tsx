// src/components/TaskTable.tsx
"use client"; // Needed for Ant interactivity

import { Table, Tag } from "antd";
import { TaskStatus, type Task } from "@/lib/tasks"; // Assuming your types.ts path
import { useEffect, useState } from "react";
import CurrentTaskModal from "./CurrentTaskModal";
import DeleteTask from "./DeleteTask";

interface TaskTableProps {
  tasks: Task[];
}

export default function TaskTable({ tasks }: TaskTableProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Task["status"]) => {
        return (
          (status === TaskStatus.PENDING && (
            <Tag color="orange">Pending</Tag>
          )) ||
          (status === TaskStatus.IN_PROGRESS && (
            <Tag color="blue">In Progress</Tag>
          )) ||
          (status === TaskStatus.COMPLETED && (
            <Tag color="green">Completed</Tag>
          ))
        );
      }, // Plain text, no styling yet
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (dueDate?: string) =>
        dueDate
          ? new Intl.DateTimeFormat("en-GB").format(new Date(dueDate))
          : "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Task) => (
        <>
          <CurrentTaskModal {...record} />
          <DeleteTask id={record.id} />
        </>
      ),
    },
  ];

  useEffect(() => {
    setLoading(tasks.length === 0);
  }, [tasks]);

  return (
    <Table
      dataSource={tasks}
      columns={columns}
      rowKey={(record) => {
        return record.id.toString();
      }} // Unique key for rows
      pagination={false} // No paging for simplicity
      loading={loading}
    />
  );
}
