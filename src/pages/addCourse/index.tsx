import { Form, Input, Button, Checkbox, Row, Col, message, Select } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { ReactNode, useEffect, useState } from 'react';
import { getCoursesByCollege, addCourse } from '@/services/course';
import { getAllClass } from '@/services/class';
import { course } from '@/type/index';

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 6 },
};
const tailLayout = {
  wrapperCol: { offset: 3, span: 6 },
};
interface classes {
  id: number;
  name: string;
}
const AddCourse = () => {
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    try {
      const data = await addCourse(values);
      message.success(data.msg);
      form.resetFields();
    } catch (err) {
      message.error(err.message);
    }
  };
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  useEffect(() => {
    getCoursesByCollege()
      .then((data) => {
        setCourses(data);
      })
      .catch((err: Error) => {
        message.error(err.message);
      });
    getAllClass()
      .then((data) => {
        setClasses(data);
      })
      .catch((err: Error) => {
        message.error(err.message);
      });
  }, []);

  var CheckboxByClasses = classes.map<ReactNode>(function (item: classes) {
    return (
      <Col span={32} key={item.id}>
        <Checkbox value={item.id} style={{ lineHeight: '32px' }}>
          {item.name}
        </Checkbox>
      </Col>
    );
  });
  const onReset = () => {
    form.resetFields();
  };
  return (
    <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
      <Form.Item
        name="courseId"
        label="课程名"
        rules={[{ required: true, message: '请输入课程名' }]}
      >
        <Select style={{ width: '90%' }}>
          {courses.map((course: course) => (
            <Select.Option key={course.id} value={course.id}>
              {course.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="classes"
        label="任课班级"
        rules={[{ required: true, message: '至少选择一个班级' }]}
      >
        <Checkbox.Group>
          <Row>{CheckboxByClasses}</Row>
        </Checkbox.Group>
      </Form.Item>
      {/* 动态表单项 */}
      <Form.List
        name="experiments"
        // rules={[
        //   {
        //     validator: async (_, names) => {
        //       if (!names || names.length < 1) {
        //         return Promise.reject(new Error('最少添加一个实验报告'));
        //       }
        //     },
        //   },
        // ]}
      >
        {/* fields就formlist里的小item内容，formlist用于动态操作添加表单项 */}
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                label={'实验报告' + (index + 1)}
                required={true}
                key={field.key}
              >
                <Form.Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: '请输入实验报告名称，或删除此项',
                    },
                  ]}
                  noStyle
                >
                  <Input placeholder="实验报告名称" style={{ width: '90%' }} />
                </Form.Item>
                <MinusCircleOutlined
                  // style={{marginLeft: '5px'}}
                  className="dynamic-delete-button"
                  onClick={() => remove(field.name)}
                />
              </Form.Item>
            ))}
            <Form.Item label="添加实验报告">
              <Button
                type="dashed"
                onClick={() => add()}
                // style={{ width: '60%' }}
                icon={<PlusOutlined />}
              >
                添加
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          添加课程
        </Button>
        <Button style={{ float: 'right' }} htmlType="button" onClick={onReset}>
          重置
        </Button>
      </Form.Item>
    </Form>
  );
};
export default AddCourse;
