import React, { useEffect, useState, useCallback } from 'react';
import { IRouteComponentProps, Redirect, connect } from 'umi';
import { Space, Table, Tag, message, Tooltip, Button, Input } from 'antd';
import { getStudentAndExperimentByPage, uploadScore } from '@/services/student';
interface experiment {
  id: string;
  name: string;
}
interface student {
  id: string;
  name: string;
  gradeMap: any;
  score: string;
}
interface responseData {
  count: number;
  students: Array<student>;
  experiments: Array<experiment>;
}

const gradeMap = ['未评分', '优秀', '良好', '及格', '不及格'];
const index = ({ location }: IRouteComponentProps) => {
  let state = location.state;
  let classUid = state.classUid;
  let className = state.className;
  let courseId = state.courseId;
  let courseName = state.courseName;
  if (!classUid || !courseId) {
    return <Redirect to="/"></Redirect>;
  }
  const [experiments, setExperiments] = useState([] as Array<experiment>);
  const [students, setStudents] = useState([] as Array<student>);
  const [page, setPage] = useState({ pageSize: 15, current: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  // 筛选条件
  const [searchValue, setSearchValue] = useState('');
  const [searchFilters, setSearchFilters] = useState({});
  useEffect(() => {
    getStudentAndExperimentByPage(
      courseId,
      classUid,
      page.pageSize,
      page.current,
    )
      .then((data: responseData) => {
        setPage({ ...page, total: data.count });
        setStudents(data.students);
        setExperiments(data.experiments);
      })
      .catch((err: Error) => {
        message.error(err.message);
      });
  }, [courseId, classUid]);

  let columns: Array<any> = [
    {
      title: '姓名',
      // dataIndex为展示的数据属性名
      dataIndex: 'name',
      key: 'stuName',
    },
  ];
  if (experiments.length > 0) {
    experiments.forEach((experiment: experiment, index: number) => {
      columns.push({
        title: experiment.name,
        dataIndex: students.length > 0 ? experiments[0].id : 'eid' + index,
        key: students.length > 0 ? experiments[0].id : 'eid' + index,
        render(grade: any, record: student) {
          return (
            <Tag
              color={
                record.gradeMap[experiment.id] == 4 ||
                record.gradeMap[experiment.id] == 0
                  ? 'red'
                  : 'green'
              }
            >
              {gradeMap[record.gradeMap[experiment.id]]}
            </Tag>
          );
        },
      });
    });
  }
  columns.push(
    {
      title: '总分',
      dataIndex: 'score',
      filters: [
        { text: '未评分', value: '0' },
        { text: '优秀', value: '1' },
        { text: '良好', value: '2' },
        { text: '及格', value: '3' },
        { text: '不及格', value: '4' },
      ],
      render(score: any, record: student) {
        return (
          <Tag
            color={record.score == '4' || record.score == '0' ? 'red' : 'green'}
          >
            {gradeMap[score]}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      render(record: student) {
        return (
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
                      onClick={handleScore(i + '', record)}
                      type={record.score == i + '' ? 'primary' : 'default'}
                      size="small"
                      key={grade}
                    >
                      {grade}
                    </Button>
                  );
                })}
              </Space>
            }
          >
            <Button style={{ fontSize: '12px' }} size="small">
              评分
            </Button>
          </Tooltip>
        );
      },
    },
  );
  const handleScore = (score: string, student: student) => {
    return function () {
      if (score != student.score) {
        setLoading(true);
        uploadScore(courseId, student.id, score)
          .then((data) => {
            message.success(data.msg);
            // 前端视图更新
            setStudents(
              students.map((s: student) => {
                if (s.id === student.id) {
                  s.score = score;
                }
                return s;
              }),
            );
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
  const handleTableChange = (page: any, filters: any, sorter: any) => {
    setLoading(true);
    setSearchFilters(filters);
    getStudentAndExperimentByPage(
      courseId,
      classUid,
      page.pageSize,
      page.current,
      {
        ...filters,
        name: searchValue,
      },
    )
      .then((data: responseData) => {
        setPage({ ...page, total: data.count });
        setStudents(data.students);
        setLoading(false);
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };
  const handleSearchChange = (value: string) => {
    setLoading(true);
    getStudentAndExperimentByPage(
      courseId,
      classUid,
      page.pageSize,
      page.current,
      {
        ...searchFilters,
        name: value,
      },
    )
      .then((data: responseData) => {
        setPage({
          current: 1,
          pageSize: page.pageSize,
          total: data.count,
        });
        setStudents(data.students);
        setLoading(false);
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };
  return (
    <div>
      <div style={{ overflow: 'hidden', marginBottom: '10px' }}>
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
          onSearch={handleSearchChange}
        ></Input.Search>
      </div>
      <Table
        columns={columns}
        loading={loading}
        pagination={{ ...page }}
        rowKey="id"
        onChange={handleTableChange}
        dataSource={students}
      ></Table>
    </div>
  );
};

export default index;
