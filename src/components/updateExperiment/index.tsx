import React, { useEffect } from 'react';
import { Form, Input, Button, DatePicker, message } from 'antd';
import { updateExperiment } from '@/services/experiment';
import { experiment } from '@/type';
import moment from 'moment';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 6 },
};
function UpdateExperiment({
  data,
  hidden,
  updateExperiments,
  experiments,
}: {
  data: experiment;
  experiments: Array<experiment>;
  hidden: Function;
  updateExperiments: Function;
}) {
  var finish = async (values: any) => {
    var deadline = values.deadline.format('YYYY-MM-DD');
    if (data.deadline == deadline && data.name == values.name) {
      // 没有修改
      message.warning('没有改动');
      hidden(false);
      return;
    }
    for (var i = 0; i < experiments.length; i++) {
      if (experiments[i].name === values.name) {
        message.warning('名字重复，请重新输入');
        return;
      }
    }
    try {
      const result = await updateExperiment(
        data.id,
        values.name,
        deadline,
        data.submitted,
      );
      if (result.success) {
        hidden(false);
        //更新前端视图
        updateExperiments(result.data.experiments[0]);
      }
    } catch (err) {
      message.error(err.message);
    }
  };
  const [form] = Form.useForm();
  // 副作用函数，在渲染完后再执行
  useEffect(() => {
    form.setFieldsValue({
      name: data.name,
      deadline: moment(data.deadline, 'YYYY-MM-DD'),
    });
  }, [data]);

  return (
    <div>
      <Form
        form={form}
        {...layout}
        name="normal_updateExperiment"
        className="updateExperiment-form"
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
          rules={[{ required: true, message: '必须截止日期！' }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button htmlType="submit" className="updateExperiment-form-button">
            修改
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
export default UpdateExperiment;
