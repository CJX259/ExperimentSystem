import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { updatePassword } from '@/services/teacher';
export default function UpdatePassword() {
  const onFinish = (values: any) => {
    const { oldPassword, newPassword, confirmPassword } = values;
    if (confirmPassword !== newPassword) {
      message.warning('输入两次密码不一致');
      return;
    }
    if (oldPassword === newPassword) {
      message.warning('新旧密码一致');
      return;
    }
    // 密码长度，内容判断
    // 字母开头，内容只能是数字字母下划线，长度6-18
    const reg = /^[a-zA-Z]\w{5,17}$/;
    var res = reg.test(newPassword);
    if (!res) {
      message.warning('密码内容只能是数字、字母、下划线，长度6到18');
      return;
    }
    updatePassword(oldPassword, newPassword)
      .then((data) => {
        message.success(data.msg, 0.5);
        form.resetFields();
      })
      .catch((err: Error) => {
        message.error(err.message);
      });
  };
  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 10 },
  };
  const tailLayout = {
    wrapperCol: { offset: 3, span: 10 },
  };
  const [form] = Form.useForm();

  return (
    <Form {...layout} form={form} name="updatePassword" onFinish={onFinish}>
      <Form.Item
        label="原密码"
        name="oldPassword"
        rules={[{ required: true, message: '必须输入原密码！' }]}
      >
        <Input.Password placeholder="请输入原密码" />
      </Form.Item>
      <Form.Item
        label="新密码"
        name="newPassword"
        rules={[{ required: true, message: '必须输入新密码！' }]}
      >
        <Input.Password placeholder="请输入新密码" />
      </Form.Item>
      <Form.Item
        label="确认密码"
        name="confirmPassword"
        rules={[{ required: true, message: '必须确认密码！' }]}
      >
        <Input.Password placeholder="请再输入新密码" />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          更改密码
        </Button>
      </Form.Item>
    </Form>
  );
}
