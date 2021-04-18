import React, { useEffect, useState } from 'react';
import { IRouteComponentProps } from 'umi';
import {
  getStuByClassByPage,
  changePermit,
  uploadGrade,
  uploadIsShow,
} from '../../services/student';
import { downloadExperiment } from '@/services/experiment';
import { Table, Tag, Space, Button, message, Tooltip } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { student, grade } from '@/type/index';
// 展示该班级下选了该课程的学生，以及它们实验报告的提交情况
export default function DetailExperiment({ location }: IRouteComponentProps) {
  let state = location.state;
  // 分页变量
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState({ pageSize: 6, current: 1, total: 0 });
  const [students, setStudents] = useState({ count: 0, students: [] });
  useEffect(() => {
    setLoading(true);
    getStuByClassByPage(
      state.classId,
      state.experiment,
      page.current,
      page.pageSize,
    )
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
      render(grade: string, record: student) {
        return (
          <Space>
            {grade ? grade : '未评分'}
            {record.isShow == '1' ? (
              <Tag color="green">{'优秀报告'}</Tag>
            ) : null}
          </Space>
        );
      },
      filters: [
        { text: '优秀', value: '优秀' },
        { text: '良好', value: '良好' },
        { text: '及格', value: '及格' },
        { text: '不及格', value: '不及格' },
        { text: '未评分', value: '未评分' },
      ],
    },
    {
      title: '提交状态',
      dataIndex: 'status',
      key: 'status',
      render(status: string) {
        return (
          <Tag color={status == '1' ? 'green' : 'red'}>
            {status == '1' ? '已提交' : '未提交'}
          </Tag>
        );
      },
      filters: [
        { text: '未提交', value: '0' },
        { text: '已提交', value: '1' },
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
            <Button type="dashed" style={{ fontSize: '12px' }} size="small">
              预览
            </Button>
            <Tooltip
              trigger="click"
              overlayStyle={{
                maxWidth: '600px',
              }}
              title={
                <Space>
                  <Button
                    onClick={handleGrade('优秀', record)}
                    type={record.grade == '优秀' ? 'primary' : 'default'}
                    size="small"
                  >
                    优秀
                  </Button>
                  <Button
                    onClick={handleGrade('良好', record)}
                    type={record.grade == '良好' ? 'primary' : 'default'}
                    size="small"
                  >
                    良好
                  </Button>
                  <Button
                    onClick={handleGrade('及格', record)}
                    type={record.grade == '及格' ? 'primary' : 'default'}
                    size="small"
                  >
                    及格
                  </Button>
                  <Button
                    onClick={handleGrade('不及格', record)}
                    type={record.grade == '不及格' ? 'primary' : 'default'}
                    size="small"
                  >
                    不及格
                  </Button>
                  <Button
                    onClick={handleGrade('展示报告', record)}
                    type={record.isShow == '1' ? 'primary' : 'default'}
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
      render(open: string, record: student) {
        return (
          <Button
            type="primary"
            size="small"
            style={{ fontSize: '12px' }}
            danger={open == '1'}
            onClick={handleOpenClick(record)}
          >
            {open == '1' ? '关闭' : '开启'}
          </Button>
        );
      },
      filters: [
        { text: '未开启', value: '0' },
        { text: '已开启', value: '1' },
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
            onClick={handleDownload(record)}
            icon={<DownloadOutlined />}
            size="small"
          ></Button>
        );
      },
    },
  ];
  // 开启/关闭通道
  const handleOpenClick = (student: student) => {
    return function () {
      setLoading(true);
      changePermit(student.id, student.com_permit == '0' ? '1' : '0')
        .then(() => {
          message.success('修改成功');
          // 修改前端视图
          setStudents({
            count: students.count,
            students: students.students.map((s: student) => {
              if (s.id === student.id) {
                s.com_permit = s.com_permit == '0' ? '1' : '0';
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
      if (student.status == '0') {
        message.warning('该学生还未提交实验报告');
        return;
      }
      if (grade !== '展示报告') {
        if (grade !== student.grade) {
          // 发送请求修改分数,不处理展示报告
          setLoading(true);
          uploadGrade(student.id, grade)
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
      } else {
        // 处理展示报告,grade不变
        uploadIsShow(student.id, student.isShow == '1' ? '0' : '1')
          .then((data) => {
            message.success('设置成功');
            // 前端视图更新
            setLoading(true);
            setStudents({
              count: students.count,
              students: students.students.map((s: student) => {
                if (s.id === student.id) {
                  s.isShow = s.isShow == '1' ? '0' : '1';
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
  // 当table状态改变时触发，传值是此表格下一个数据，以及表格中筛选和排序的信息
  // （翻页，点击筛选条件都会触发）
  const handleTableChange = (page: any, filters: any, sorter: any) => {
    // 如果filter信息变了，就重置页面到第一页(antd的table自带的page组件帮我完成了~)
    setLoading(true);
    getStuByClassByPage(
      state.classId,
      state.experiment,
      page.current,
      page.pageSize,
      filters,
    )
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

  return (
    <div>
      <Table
        rowKey="id"
        pagination={{ ...page, total: students.count }}
        columns={columns}
        loading={loading}
        onChange={handleTableChange}
        dataSource={students.students}
      />
    </div>
  );
}
