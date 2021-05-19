import React, { useEffect, useState } from 'react';
import { IRouteComponentProps, Redirect, connect } from 'umi';
import { Space, Table, Tag, message, Tooltip, Button } from 'antd';
import { getStudentAndExperimentByPage } from '@/services/student';
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
  const [page, setPage] = useState({ pageSize: 5, current: 1, total: 0 });
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
                record.gradeMap[grade] == 0
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
        console.log(score);
        return (
          <Tag
            color={
              record.gradeMap[score] == 4 || record.gradeMap[score] == 0
                ? 'red'
                : 'green'
            }
          >
            {gradeMap[score]}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      render(record: student) {
        console.log(record);
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
                      onClick={() => {}}
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
  return (
    <div>
      <Table
        columns={columns}
        // pagination={{ ...page, total: students.count }}
        rowKey="id"
        dataSource={students}
      ></Table>
    </div>
  );
};

export default index;
