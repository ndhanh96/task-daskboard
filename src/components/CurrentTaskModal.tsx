import React, { useEffect, useState, useTransition } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import { Task } from "@/lib/tasks";
import dayjs from "dayjs";
import { updateTaskAction } from "@/lib/db";

function CurrentTaskModal({ id, title, description, status, dueDate }: Task) {
  const [open, setOpen] = useState(false);
  const [CurrentTaskModalForm] = Form.useForm();
  const [isPending, startTransition] = useTransition();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await CurrentTaskModalForm.validateFields();
      startTransition(async () => {
        try {
          await updateTaskAction(id, values); // Mutates + revalidates
          CurrentTaskModalForm.resetFields();
        } catch (error) {
          console.log("Update failed:", error);
        }
      });
      setOpen(false);
    } catch (errorInfo) {
      // If validation fails, antd shows errors automatically
      console.log("Validation failed:", errorInfo);
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  useEffect(() => {
    CurrentTaskModalForm.setFieldsValue({
      title,
      description,
      status,
      dueDate: dayjs(dueDate),
    });
  }, [CurrentTaskModalForm, title, description, status, dueDate]);

  return (
    <>
      <Button icon={<PlusOutlined />} onClick={showModal}>
        Edit
      </Button>
      <Modal
        title="Edit Current Task"
        open={open}
        onOk={handleOk}
        confirmLoading={isPending}
        onCancel={handleCancel}
        destroyOnHidden
      >
        <Form
          form={CurrentTaskModalForm}
          name={`current-task-${id}`}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          {/* Form fields for task details can be added here */}
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "please input title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "please input your description" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="in_progress">In Progress</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Due Date"
            name="dueDate"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default CurrentTaskModal;
