import { IRouteComponentProps, connect, Link } from 'umi';
import {
  Layout,
  Menu,
  Breadcrumb,
  Button,
  Popconfirm,
  message,
  Spin,
  notification,
} from 'antd';
import {
  DesktopOutlined,
  SettingOutlined,
  TableOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
import styles from './index.less';
import { UserModelState } from '@/models/user';
import { course, loading } from '@/type/index';
import { getCoursesByTeacher } from '@/services/course';
import { getAnnouncement } from '@/services/announcement';
// courseId的值为course的uid！！！！
interface allDispatchProps {
  loginByCookie: () => void;
  logout: () => void;
}
type PageLayout = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;
// import Header from '@/components/Header';
const PageLayout: React.FC<PageLayout> = ({
  user,
  loading,
  loginByCookie,
  logout,
  children,
  location,
  route,
  history,
  match,
}: IRouteComponentProps & { user: UserModelState; loading: loading }) => {
  // 登录则不要渲染
  if (location.pathname === '/login') {
    return <div>{children}</div>;
  }
  const [courses, setCourses] = useState([]);
  const [courseLoading, setCourseLoading] = useState(false);
  // 使用两个useEffect，分别请求不同的内容（但是如果从login页面正常登录，就无法触发第二个useEffect，因为它依赖于user.tid，正常登录来的user本来就有值）
  // 解决方法: 让login成功后不设置user,到此页面后再调用loginByCookie来设置user,以达改变user.tid从而触发useEffect目的
  // 好处: 防止页面在未登录的情况下（即没有cookie信息），请求所有接口，导致一次报太多错误，以及节省http请求
  useEffect(() => {
    try {
      loginByCookie();
    } catch (err) {
      // model那里定义的跳转了。
      message.error(err.message);
    }
  }, []);
  // index页面刷新和login登录进来，都能执行两遍这个useEffect即为成功
  useEffect(() => {
    // 没有tid就不请求
    // 当loginByCookie成功后user.tid改变,触发此副作用函数
    // 以实现顺序请求的目的!!
    if (!user.tid) {
      return;
    }
    setCourseLoading(true);
    getCoursesByTeacher()
      .then((data) => {
        setCourses(data);
      })
      .catch((err: Error) => {
        message.error(err.message);
      })
      .finally(() => {
        setCourseLoading(false);
      });
    getAnnouncement()
      .then((data) => {
        const contents = data.data.contents || [];
        if (contents.length >= 0) {
          for (let i = 0; i < contents.length; i++) {
            const option = {
              duration: 0,
              message: '通知',
              description: '',
              top: 65,
              icon: <SmileOutlined style={{ color: '#008c8c' }} />,
            };
            option.description = contents[i].content;
            notification.open(option);
          }
        }
      })
      .catch((err: Error) => {
        message.error(err.message);
      });
  }, [user.tid]);
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
      <Spin spinning={loading.global || courseLoading}>
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
                {courses.map((course: course) => {
                  return (
                    <Menu.Item key={'sub1_' + course.uid}>
                      <Link
                        to={{
                          pathname: '/selectcourse',
                          state: {
                            courseId: course.uid,
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
              {/* 面包屑 */}
              <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>
                  <Link
                    to={{
                      pathname: '/',
                      state: {},
                    }}
                  >
                    {user.name}
                  </Link>
                </Breadcrumb.Item>
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
                      return (
                        <Breadcrumb.Item>
                          <Link
                            to={{
                              pathname: '/selectcourse',
                              state: {
                                courseId: state.courseId,
                                courseName: state.courseName,
                              },
                            }}
                          >
                            {courseName}
                          </Link>
                        </Breadcrumb.Item>
                      );
                    case '/selectexperiment':
                      // 匹配到实验报告路径，也是返回课程名，因为下一个item需要这个课程名拼接
                      var state = location.state || {};
                      var courseName = state.courseName || '';
                      return (
                        <Breadcrumb.Item>
                          <Link
                            to={{
                              pathname: '/selectcourse',
                              state: {
                                courseId: state.courseId,
                                courseName: state.courseName,
                              },
                            }}
                          >
                            {courseName}
                          </Link>
                        </Breadcrumb.Item>
                      );
                    case '/detailexperiment':
                      var state = location.state || {};
                      var courseName = state.courseName || '';
                      return (
                        <Breadcrumb.Item>
                          <Link
                            to={{
                              pathname: '/selectcourse',
                              state: {
                                courseId: state.courseId,
                                courseName: state.courseName,
                              },
                            }}
                          >
                            {courseName}
                          </Link>
                        </Breadcrumb.Item>
                      );
                    default:
                      break;
                  }
                })()}
                {(function () {
                  var pathname = location.pathname;
                  if (
                    pathname == '/selectexperiment' ||
                    pathname == '/detailexperiment'
                  ) {
                    var state = location.state || {};
                    var className = state.className;
                    return (
                      <Breadcrumb.Item>
                        <Link
                          to={{
                            pathname: '/selectexperiment',
                            state: {
                              courseId: state.courseId,
                              courseName: state.courseName,
                              classUid: state.classUid,
                              className: state.className,
                            },
                          }}
                        >
                          {className}
                        </Link>
                      </Breadcrumb.Item>
                    );
                  }
                })()}
                {(function () {
                  var pathname = location.pathname;
                  if (pathname == '/detailexperiment') {
                    var state = location.state || {};
                    var experimentName = state.experiment.name;
                    return <Breadcrumb.Item>{experimentName}</Breadcrumb.Item>;
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
      </Spin>
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
    case '/detailexperiment':
      if (!location.state) {
        return [];
      }
      var courseId = location.state.courseId;
      return [`sub1_${courseId}`];
    default:
      return [];
  }
}

function mapStateToProps({
  user,
  loading,
}: {
  user: UserModelState;
  loading: loading;
}) {
  return {
    user,
    loading,
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
