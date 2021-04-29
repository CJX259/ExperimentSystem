import React, { MouseEventHandler, useEffect, useState } from 'react';
import { IRouteComponentProps, Redirect, connect } from 'umi';
import {
  getStuByClassByPage,
  changePermit,
  uploadGrade,
  uploadIsShow,
} from '../../services/student';
import { downloadExperiment } from '@/services/experiment';
import {
  Table,
  Tag,
  Space,
  Button,
  message,
  Tooltip,
  Modal,
  Input,
} from 'antd';
import { DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import { student, grade, experiment } from '@/type/index';
import { remindSubmit } from '@/services/message';
import { UserModelState } from '@/models/user';
import styles from './index.less';
// 因为从1开始
const gradeMap = ['未评分', '优秀', '良好', '及格', '不及格'];
// 展示该班级下选了该课程的学生，以及它们实验报告的提交情况
function DetailExperiment({
  location,
  user,
}: IRouteComponentProps & { user: UserModelState }) {
  // 不输出，umi会自动优化，就不导入index.less了（因为没地方用到里面的属性~）
  console.log(styles);
  let state = location.state;
  var experiment: experiment = state.experiment;
  var classUid = state.classUid;
  if (!experiment || !classUid) {
    return <Redirect to="/"></Redirect>;
  }
  // 分页变量
  const [loading, setLoading] = useState(false);
  // 多选的行
  const [selectKeys, setSelectKeys] = useState([]);
  // 预览modal
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [page, setPage] = useState({ pageSize: 7, current: 1, total: 0 });
  // 控制table中的节流timer数组(看下单个timer能不能行，不行就用数组的)
  // const [timers, setTimers] = useState(new Array(page.pageSize).fill(null));
  // 控制table中的节流timer
  const [timer, setTimer] = useState(null);
  const [students, setStudents] = useState({ count: 0, students: [] });
  const [searchValue, setSearchValue] = useState('');
  const [searchFilters, setSearchFilters] = useState({});
  useEffect(() => {
    setLoading(true);
    getStuByClassByPage(classUid, experiment.id, page.current, page.pageSize)
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  }, [state]);
  const columns = [
    {
      title: '姓名',
      // dataIndex为展示的数据属性名
      dataIndex: 'name',
      key: 'stuName',
    },
    {
      title: '分数',
      dataIndex: 'grade',
      key: 'grade',
      render(grade: number, record: student) {
        return (
          <Space>
            {grade ? gradeMap[grade] : '未评分'}
            {record.isShow ? <Tag color="green">{'优秀报告'}</Tag> : null}
          </Space>
        );
      },
      filters: [
        { text: '未评分', value: '0' },
        { text: '优秀', value: '1' },
        { text: '良好', value: '2' },
        { text: '及格', value: '3' },
        { text: '不及格', value: '4' },
      ],
    },
    {
      title: '提交状态',
      dataIndex: 'status',
      key: 'status',
      render(status: number) {
        return (
          <Tag color={status ? 'green' : 'red'}>
            {status ? '已提交' : '未提交'}
          </Tag>
        );
      },
      filters: [
        { text: '未提交', value: 0 },
        { text: '已提交', value: 1 },
      ],
    },
    {
      title: '提交次数',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '操作',
      render(record: student) {
        //record能拿到当前行数据
        return (
          <Space>
            <Button
              type="dashed"
              onClick={handlePreview(record)}
              style={{ fontSize: '12px' }}
              size="small"
            >
              预览
            </Button>

            <Tooltip
              trigger="click"
              overlayStyle={{
                maxWidth: '600px',
              }}
              title={
                <Space>
                  {gradeMap.map((grade: string, i: number) => {
                    return (
                      <Button
                        // 传‘1’代表优秀，是grade的1
                        onClick={handleGrade((i + '') as grade, record)}
                        type={record.grade == i + '' ? 'primary' : 'default'}
                        size="small"
                        key={grade}
                      >
                        {grade}
                      </Button>
                    );
                  })}
                  <Button
                    onClick={throttle(handleIsShow(record), true, 500)}
                    type={record.isShow ? 'primary' : 'default'}
                    size="small"
                  >
                    公开展示报告
                  </Button>
                </Space>
              }
            >
              <Button style={{ fontSize: '12px' }} size="small">
                评分
              </Button>
            </Tooltip>
          </Space>
        );
      },
    },
    {
      title: '提交通道',
      dataIndex: 'com_permit',
      render(open: number, record: student) {
        return (
          <Button
            type="primary"
            size="small"
            style={{ fontSize: '12px' }}
            danger={!!open}
            onClick={throttle(handleOpenClick(record), true, 500)}
          >
            {open ? '关闭' : '开启'}
          </Button>
        );
      },
      filters: [
        { text: '未开启', value: 0 },
        { text: '已开启', value: 1 },
      ],
    },
    {
      title: '下载',
      render(record: student) {
        return (
          <Button
            type="primary"
            style={{ fontSize: '12px' }}
            shape="round"
            onClick={throttle(handleDownload(record))}
            icon={<DownloadOutlined />}
            size="small"
          ></Button>
        );
      },
    },
  ];
  const onSelectChange = (selectKeysData: any) => {
    // selectKeysData为被选中元素的key，也就是id
    setSelectKeys(selectKeysData);
  };
  // 处理打开预览
  const handlePreview = (student: student) => {
    return function () {
      setPreviewUrl(student.experPath);
      setPreviewVisible(true);
    };
  };
  // 处理关闭预览
  const handleCancel = () => {
    setPreviewVisible(false);
    setPreviewUrl('');
  };
  // 处理多选
  const rowSelection = {
    selectedRowKeys: selectKeys,
    onChange: onSelectChange,
  };
  // 开启/关闭通道
  const handleOpenClick = (student: student) => {
    return function () {
      setLoading(true);
      changePermit(experiment.id, student.id, student.com_permit ? 0 : 1)
        .then(() => {
          message.success('修改成功');
          // 修改前端视图
          setStudents({
            count: students.count,
            students: students.students.map((s: student) => {
              if (s.id === student.id) {
                s.com_permit = s.com_permit ? 0 : 1;
              }
              return s;
            }) as never,
          });
        })
        .catch((err: Error) => {
          message.error(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };
  };
  // 处理评分
  const handleGrade = (grade: grade, student: student) => {
    return function () {
      if (!student.status) {
        message.warning('该学生还未提交实验报告');
        return;
      }
      if (grade !== student.grade) {
        // 发送请求修改分数,不处理展示报告
        setLoading(true);
        uploadGrade(experiment.id, student.id, grade)
          .then((data) => {
            message.success('评分成功');
            // 前端视图更新
            setStudents({
              count: students.count,
              students: students.students.map((s: student) => {
                if (s.id === student.id) {
                  s.grade = grade;
                }
                return s;
              }) as never,
            });
          })
          .catch((err: Error) => {
            message.error(err.message);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    };
  };
  const handleIsShow = (student: student) => {
    return function () {
      if (!student.status) {
        message.warning('该学生还未提交实验报告');
        return;
      }
      // 处理展示报告,grade不变
      uploadIsShow(experiment.id, student.id, student.isShow ? 0 : 1)
        .then((data) => {
          message.success('设置成功');
          // 前端视图更新
          setLoading(true);
          setStudents({
            count: students.count,
            students: students.students.map((s: student) => {
              if (s.id === student.id) {
                s.isShow = s.isShow ? 0 : 1;
              }
              return s;
            }) as never,
          });
        })
        .catch((err: Error) => {
          message.error(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };
  };
  // 处理下载
  const handleDownload = (student: student) => {
    return function () {
      downloadExperiment(student.experPath)
        .then((data) => {
          console.log(data);
        })
        .catch((err: Error) => {
          message.error(err.message);
        });
    };
  };
  // 处理批量下载
  const handleMuchDownload = () => {
    selectKeys.forEach((studentId: string) => {
      // 通过学生id，在学生数组中找到一致的项，再拿到路径
      for (let i = 0; i < students.students.length; i++) {
        let stu = students.students[i] as student;
        if (stu.id == studentId) {
          downloadExperiment(stu.experPath)
            .then((data) => {
              console.log(data);
            })
            .catch((err: Error) => {
              message.error(err.message + ' in student ' + stu.name);
            });
          // for完成，继续执行forEach
          break;
        }
      }
    });
  };
  // 当table状态改变时触发，传值是此表格下一个数据，以及表格中筛选和排序的信息
  // （翻页，点击筛选条件都会触发）
  const handleTableChange = (page: any, filters: any, sorter: any) => {
    // 如果filter信息变了，就重置页面到第一页(antd的table自带的page组件帮我完成了~)
    // 需要清除多选信息
    setLoading(true);
    setSelectKeys([]);
    setSearchFilters(filters);
    getStuByClassByPage(classUid, experiment.id, page.current, page.pageSize, {
      ...filters,
      name: searchValue,
    })
      .then((data) => {
        setPage({ ...page, total: data.count });
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };
  function remindStudent(this: any) {
    remindSubmit(user.tid, classUid, experiment.id)
      .then((data) => {
        message.success(data.msg, 0.5);
      })
      .catch((err: Error) => {
        message.error(err.message);
      });
  }
  // 节流处理,先直接执行函数
  // isRender为true，则是处理会重新渲染table的异步函数
  // 此时使用的timer是state中的timer
  // （目的是重新渲染table时，不会因为重新给onclick绑定事件而导致的throttle节流函数重新执行，导致闭包里的timer被重新初始化
  // 从而导致节流无效，放timer到state中就不会被重新初始化！）

  function throttle(
    this: any,
    fn: Function,
    isRender: boolean = false,
    duration: number = 1500,
    ...args: any
  ) {
    let _timer: any = null;
    let _this = this;
    return function () {
      let _args = [].concat(...args, arguments as any);
      if (!isRender && _timer == null) {
        fn.apply(_this, _args);
        _timer = setTimeout(() => {
          _timer = null;
        }, duration);
      } else if (isRender && timer == null) {
        fn.apply(_this, _args);
        var temp = setTimeout(() => {
          setTimer(null);
        }, duration);
        setTimer(temp as any);
      }
    };
  }
  return (
    <div>
      <div
        style={{
          marginBottom: '10px',
        }}
        // style={{ transform: 'translateY(-48px)', display: 'inline-block' }}
      >
        <Button
          type="primary"
          onClick={throttle(handleMuchDownload)}
          disabled={selectKeys.length === 0}
          loading={loading}
        >
          批量下载
        </Button>
        <span style={{ marginLeft: 8 }}>
          {selectKeys.length !== 0 ? `已选择 ${selectKeys.length} 项` : ''}
        </span>
        <Input.Search
          placeholder="搜索学生名字"
          style={{
            width: 'auto',
            float: 'right',
          }}
          enterButton={true}
          //两种做法
          // 点击搜索再改searchKey
          // 输入的时候就改searchKey
          onChange={(e) => {
            // 给那边筛选的时候，插入name属性
            setSearchValue(e.target.value);
          }}
          onSearch={(value) => {
            setLoading(true);
            getStuByClassByPage(classUid, experiment.id, 1, page.pageSize, {
              ...searchFilters,
              name: value,
            })
              .then((data) => {
                setPage({
                  current: 1,
                  pageSize: page.pageSize,
                  total: data.count,
                });
                setStudents(data);
                setLoading(false);
              })
              .catch((err) => {
                message.error(err.message);
                setLoading(false);
              });
          }}
        ></Input.Search>
      </div>
      <Table
        rowSelection={rowSelection}
        rowKey="id"
        pagination={{ ...page, total: students.count }}
        columns={columns}
        loading={loading}
        onChange={handleTableChange}
        dataSource={students.students}
      />
      <Button
        style={{ transform: 'translateY(-48px)' }}
        onClick={throttle(remindStudent)}
      >
        一键催交
      </Button>
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={handleCancel}
        closeIcon={
          <CloseOutlined style={{ transform: 'translate(10px, -10px)' }} />
        }
        width={1200}
        style={{
          top: '10px',
        }}
      >
        {previewUrl != '' ? (
          <iframe
            title="PDF"
            className="scrolling"
            scrolling="no"
            frameBorder="0"
            id="press"
            src={previewUrl}
            width="100%"
            height={630}
          />
        ) : null}
      </Modal>
    </div>
  );
}
function mapStateToProps({ user }: { user: UserModelState }) {
  return {
    user,
  };
}
export default connect(mapStateToProps)(DetailExperiment);
