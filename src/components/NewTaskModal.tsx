import React, { useState } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import { addNewTask } from "./AddNewTask";
import { PlusOutlined } from "@ant-design/icons";

// For TypeScript: Define the shape of your form values

function NewTaskModal() {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [NewTaskModalForm] = Form.useForm();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    try {
      const values = await NewTaskModalForm.validateFields();
      try {
        await addNewTask(values);
        NewTaskModalForm.resetFields();
      } catch (error) {
        throw error;
      }

      setConfirmLoading(false);
      setOpen(false);
    } catch (errorInfo) {
      // If validation fails, antd shows errors automatically
      console.log("Validation failed:", errorInfo);
      setConfirmLoading(false); // Stop loading if failed
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
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
        confirmLoading={confirmLoading}
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
        </Form>
      </Modal>
    </>
  );
}

export default NewTaskModal;
