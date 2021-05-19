import { connect, history, Redirect } from 'umi';
import { UserModelState } from '@/models/user';
import React from 'react';
import { Form, Input, Button, Spin, message } from 'antd';
import { loadingModelState } from '@/type/index';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './index.less';
// 默认的props类型，作测试
const DefaultProps = {
  // ip: "127.0.0.1"
};
// 连接redux的user模型的接口定义
interface UserStateProps {
  user: UserModelState;
}

interface loadingStateProps {
  loading: loadingModelState;
}
// 连接redux的dispatch的接口定义
interface UserDispatchProps {
  login: (name: string, password: string) => void;
}
// 拼接state和dispatch的props，默认props的类型，作为该函数组件的类型约束，才能在connect函数中正确调用
export type LoginReduxType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  Readonly<typeof DefaultProps>;

//函数组件, 并对其props约束
const Login: React.FC<LoginReduxType> = ({ user, login, loading }) => {
  if (document.cookie.indexOf('userToken') !== -1) {
    return <Redirect to="/" />;
  }
  var onFinish = (values: { teacherId: string; password: string }) => {
    try {
      login(values.teacherId, values.password);
    } catch (err) {
      message.error(err.message);
    }
  };
  return (
    <Spin spinning={loading.global}>
      <div className={styles.wrapper}>
        <div id={styles.login}>
          {/* <h1 style={{ textAlign: 'center' }}>广州大学实验报告上传系统</h1> */}
          <h2 style={{ textAlign: 'center' }}>教师端登录</h2>
          <Form name="normal_login" className="login-form" onFinish={onFinish}>
            <Form.Item
              name="teacherId"
              rules={[{ required: true, message: '必须输入教师id！' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="请输入教师id"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '必须输入密码！' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            <Form.Item className={styles['row-center']}>
              <Button htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Spin>
  );
};
// 设置父级默认props
Login.defaultProps = DefaultProps;

function mapDispatchToProps(dispatch: Function): UserDispatchProps {
  return {
    login(teacherId: string, password: string) {
      dispatch({
        type: 'user/login',
        payload: { teacherId, password },
      });
    },
  };
}
// 第一个参数为state
function mapStateToProps({
  user,
  loading,
}: {
  user: UserModelState;
  loading: loadingModelState;
}): UserStateProps & loadingStateProps {
  return {
    user,
    loading,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
