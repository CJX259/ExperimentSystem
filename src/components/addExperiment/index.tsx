import React from 'react';
import { Form, Input, Button, DatePicker, message } from 'antd';
import { addExperiment } from '@/services/experiment';
import { experiment } from '@/type';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 6 },
};
function AddExperimentComponent({
  hidden,
  updateExperiments,
  experiments,
  uid,
  classUid,
  // 其实是courseUid
  courseId,
}: {
  experiments: Array<experiment>;
  hidden: Function;
  updateExperiments: Function;
  uid: string;
  classUid: string;
  courseId: string;
}) {
  var finish = async (values: any) => {
    for (var i = 0; i < experiments.length; i++) {
      if (experiments[i].name === values.name) {
        message.warning('名字重复，请重新输入');
        return;
      }
    }
    var deadline = values.deadline.format('YYYY-MM-DD');
    try {
      console.log(uid);
      const data = await addExperiment(
        courseId,
        uid,
        classUid,
        values.name,
        deadline,
      );
      if (data.success) {
        message.success(data.msg || '添加成功');
        form.resetFields();
        hidden(false);
        //更新前端视图
        updateExperiments(data.data.experiments[0]);
      }
    } catch (err) {
      message.error(err.message);
    }
  };
  const [form] = Form.useForm();

  return (
    <div>
      <Form
        form={form}
        {...layout}
        name="normal_addExperiment"
        className="addExperiment-form"
        onFinish={finish}
      >
        <Form.Item
          name="name"
          label="实验报告名称"
          rules={[{ required: true, message: '必须输入实验报告名！' }]}
        >
          <Input placeholder="请输入实验报告名称" />
        </Form.Item>
        <Form.Item
          name="deadline"
          label="截止日期"
          rules={[{ required: true, message: '必须选择截止日期！' }]}
        >
          <DatePicker placeholder="请选择截止日期" />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button htmlType="submit" className="addExperiment-form-button">
            添加
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
export default AddExperimentComponent;
