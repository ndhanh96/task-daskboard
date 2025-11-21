"use client";
import { useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { addNewTask } from "./addNewTask";

// For TypeScript: Define the shape of your form values

function NewTaskModal({
  isPending,
  startTransition,
}: {
  isPending: boolean;
  startTransition: React.TransitionStartFunction;
}) {
  const [open, setOpen] = useState(false);
  // const [confirmLoading, setConfirmLoading] = useState(false);
  const [NewTaskModalForm] = Form.useForm();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await NewTaskModalForm.validateFields();
      startTransition(async () => {
        await addNewTask(values); // Mutates + revalidates
        NewTaskModalForm.resetFields();
        setOpen(false); // Close modal
      });
    } catch (errorInfo) {
      console.log("Validation failed:", errorInfo);
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    NewTaskModalForm.resetFields();
    setOpen(false);
  };

  return (
    <>
      <Button
        type="primary"
        size="large"
        icon={<PlusOutlined />}
        onClick={showModal}
      >
        Add New Task
      </Button>
      <Modal
        title="Add New Task"
        open={open}
        onOk={handleOk}
        confirmLoading={isPending}
        onCancel={handleCancel}
        destroyOnHidden
      >
        <Form
          form={NewTaskModalForm}
          name="new-task"
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

export default NewTaskModal;
