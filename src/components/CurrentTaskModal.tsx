import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select } from "antd";
import updateTask from "./updateTask";
import { Task } from "@/lib/tasks";

function CurrentTaskModal({ id, title, description, status }: Task) {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [CurrentTaskModalForm] = Form.useForm();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    try {
      const values = await CurrentTaskModalForm.validateFields();
      console.log({ ...values, id });
      try {
        const res = await updateTask({ ...values, id });
        console.log(res);
        CurrentTaskModalForm.resetFields();
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

  useEffect(() => {
    CurrentTaskModalForm.setFieldsValue({
      title: title,
      description,
      status,
    });
  }, [CurrentTaskModalForm, title, description, status]);

  return (
    <>
      <Button icon={<PlusOutlined />} onClick={showModal}>
        Edit
      </Button>
      <Modal
        forceRender
        title="Edit Current Task"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
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
        </Form>
      </Modal>
    </>
  );
}

export default CurrentTaskModal;
