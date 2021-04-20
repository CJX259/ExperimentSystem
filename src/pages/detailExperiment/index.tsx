import React, { useEffect, useState } from 'react';
import { IRouteComponentProps } from 'umi';
import {
  getStuByClassByPage,
  changePermit,
  uploadGrade,
  uploadIsShow,
} from '../../services/student';
import { downloadExperiment } from '@/services/experiment';
import { Table, Tag, Space, Button, message, Tooltip, Modal } from 'antd';
import { DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import { student, grade } from '@/type/index';
// 因为从1开始
const gradeMap = ['未评分', '优秀', '良好', '及格', '不及格'];
// 展示该班级下选了该课程的学生，以及它们实验报告的提交情况
export default function DetailExperiment({ location }: IRouteComponentProps) {
  let state = location.state;
  // 分页变量
  const [loading, setLoading] = useState(false);
  // 多选的行
  const [selectKeys, setSelectKeys] = useState([]);
  // 预览modal
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [page, setPage] = useState({ pageSize: 7, current: 1, total: 0 });
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
                    onClick={handleIsShow(record)}
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
            onClick={handleOpenClick(record)}
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
            onClick={handleDownload(record)}
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
      changePermit(student.id, student.com_permit ? 0 : 1)
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
    };
  };
  const handleIsShow = (student: student) => {
    return function () {
      if (!student.status) {
        message.warning('该学生还未提交实验报告');
        return;
      }
      // 处理展示报告,grade不变
      uploadIsShow(student.id, student.isShow ? 0 : 1)
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
      <div
        style={{
          marginBottom: '10px',
        }}
        // style={{ transform: 'translateY(-48px)', display: 'inline-block' }}
      >
        <Button
          type="primary"
          onClick={handleMuchDownload}
          disabled={selectKeys.length === 0}
          loading={loading}
        >
          批量下载
        </Button>
        <span style={{ marginLeft: 8 }}>
          {selectKeys.length !== 0 ? `已选择 ${selectKeys.length} 项` : ''}
        </span>
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
