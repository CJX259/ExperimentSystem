import React, { useEffect, useState } from 'react';
import { IRouteComponentProps } from 'umi';
import { getStuByClassByPage } from '../../services/student';
import { Table, Tag, Space, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { student } from '@/type/index';
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
          {record.isShow == '1' ? <Tag color="green">{'优秀报告'}</Tag> : null}
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
    sorter: true,
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
          <Button style={{ fontSize: '12px' }} size="small">
            评分
          </Button>
        </Space>
      );
    },
  },
  {
    title: '提交通道',
    dataIndex: 'com_permit',
    render(open: string) {
      return (
        <Button
          type="primary"
          size="small"
          style={{ fontSize: '12px' }}
          danger={open == '1'}
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
          icon={<DownloadOutlined />}
          size="small"
        ></Button>
      );
    },
  },
];
// 展示该班级下选了该课程的学生，以及它们实验报告的提交情况
export default function DetailExperiment({ location }: IRouteComponentProps) {
  let state = location.state;
  // 分页变量
  const [page, setPage] = useState({ pageSize: 6, current: 1, total: 0 });
  const [students, setStudents] = useState({ count: 0, students: [] });
  useEffect(() => {
    getStuByClassByPage(
      state.classId,
      state.experiment,
      page.current,
      page.pageSize,
    )
      .then((data) => {
        setStudents(data);
      })
      .catch((err) => {
        console.log('getStuError: ' + err);
      });
  }, [state]);

  // 当table状态改变时触发，传值是此表格下一个数据，以及表格中筛选和排序的信息
  // （翻页，点击筛选条件都会触发）
  const handleTableChange = (page: any, filters: any, sorter: any) => {
    // fetch({
    console.log(page, filters, sorter);
    //   sortField: sorter.field,
    //   sortOrder: sorter.order,
    //   page,
    //   ...filters,
    // });
  };

  const fetch = (params = {}) => {
    // request({
    //   url: 'https://randomuser.me/api',
    //   method: 'get',
    //   type: 'json',
    //   data: getRandomuserParams(params),
    // }).then(data => {
    //   setPage({...params.pagination});
    // });
  };
  return (
    <div>
      <Table
        rowKey="id"
        pagination={{ ...page, total: students.count }}
        columns={columns}
        // loading={true}
        onChange={handleTableChange}
        dataSource={students.students}
      />
    </div>
  );
}
