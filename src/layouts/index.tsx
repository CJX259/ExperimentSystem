import { IRouteComponentProps, connect, Link } from 'umi';
import { Layout, Menu, Breadcrumb, Button, Popconfirm, message } from 'antd';
import {
  DesktopOutlined,
  SettingOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
import styles from './index.less';
import { UserModelState } from '@/models/user';
import { getByCoursesTeacher } from '@/services/course';
// 还要包含课程等数据
interface allStateProps {
  user: UserModelState;
}
interface allDispatchProps {
  loginByCookie: () => void;
  logout: () => void;
}
interface Course {
  name: string;
  id: number;
}
type PageLayout = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;
// import Header from '@/components/Header';
const PageLayout: React.FC<PageLayout> = ({
  user,
  loginByCookie,
  logout,
  children,
  location,
  route,
  history,
  match,
}: IRouteComponentProps) => {
  // 登录则不要渲染
  if (location.pathname === '/login') {
    return <div>{children}</div>;
  }
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    try {
      loginByCookie();
    } catch (err) {
      // 登录信息有误，跳回login页面
      message.error(err.message);
    }
    getByCoursesTeacher()
      .then((data) => {
        setCourses(data);
      })
      .catch((err) => {
        message.error(err.message);
      });
  }, []);
  // 确认登出
  const handleLogout = () => {
    logout();
  };
  const [collapsed, setCollapsed] = useState(false);
  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };
  return (
    <div className="layout">
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
        >
          <div className={styles.logo} />
          <Menu
            style={{ userSelect: 'none' }}
            mode="inline"
            defaultSelectedKeys={isDefault(location)}
            defaultOpenKeys={['sub1']}
          >
            <Menu.Item key="2" icon={<DesktopOutlined />}>
              <Link to="/addcourse">添加课程</Link>
            </Menu.Item>
            <SubMenu key="sub1" icon={<TableOutlined />} title="查看课程">
              {courses.map((course: Course) => {
                return (
                  <Menu.Item key={'sub1_' + course.id}>
                    <Link
                      to={{
                        pathname: '/selectcourse',
                        state: {
                          courseId: course.id,
                          courseName: course.name,
                        },
                      }}
                    >
                      {course.name}
                    </Link>
                  </Menu.Item>
                );
              })}
            </SubMenu>
            <Menu.Item key="5" icon={<SettingOutlined />}>
              <Link to="/updatepassword">修改密码</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className={styles['site-layout']}>
          <Header
            className={styles['site-layout-background']}
            style={{ padding: 0 }}
          >
            <span className={styles.header}>
              广州大学实验报告上传系统-教师端
            </span>
            <Popconfirm
              title="确认登出吗"
              onConfirm={handleLogout}
              okText="Yes"
              cancelText="No"
            >
              <Button className={styles['right-btn']}>退出登录</Button>
            </Popconfirm>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>{user.name}</Breadcrumb.Item>
              {(function () {
                var pathname = location.pathname;
                switch (pathname) {
                  case '/addcourse':
                    return <Breadcrumb.Item>添加课程</Breadcrumb.Item>;
                  case '/updatepassword':
                    return <Breadcrumb.Item>更改密码</Breadcrumb.Item>;
                  case '/selectcourse':
                    var state = location.state || {};
                    var courseName = state.courseName || '';
                    return <Breadcrumb.Item>{courseName}</Breadcrumb.Item>;
                  case '/selectexperiment':
                    // 匹配到实验报告路径，也是返回课程名，因为下一个item需要这个课程名拼接
                    var state = location.state || {};
                    var courseName = state.courseName || '';
                    return <Breadcrumb.Item>{courseName}</Breadcrumb.Item>;
                  default:
                    break;
                }
              })()}
              {(function () {
                var pathname = location.pathname;
                if (pathname == '/selectexperiment') {
                  var state = location.state || {};
                  var className = state.className;
                  return <Breadcrumb.Item>{className}</Breadcrumb.Item>;
                }
              })()}
            </Breadcrumb>
            <div
              className={styles['site-layout-background']}
              style={{ padding: 24, minHeight: 360 }}
            >
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            广州大学实验报告上传系统 DESIGNED BY 638 TEAM
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};
function isDefault(location: { pathname: string; state: any }): Array<string> {
  var pathname = location.pathname;
  switch (pathname) {
    case '/addcourse':
      return ['2'];
    case '/updatepassword':
      return ['5'];
    case '/selectcourse':
      if (!location.state) {
        return [];
      }
      var courseId = location.state.courseId;
      return [`sub1_${courseId}`];
    case '/selectexperiment':
      if (!location.state) {
        return [];
      }
      var courseId = location.state.courseId;
      return [`sub1_${courseId}`];
    default:
      return [];
  }
}

function mapStateToProps({ user }: { user: UserModelState }) {
  return {
    user,
  };
}
function mapDispatchToProps(dispatch: Function): allDispatchProps {
  return {
    loginByCookie() {
      dispatch({ type: 'user/loginbycookie' });
    },
    logout() {
      dispatch({ type: 'user/logout' });
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PageLayout);
