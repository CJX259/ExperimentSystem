import React, { useEffect, useState } from 'react'
import { IRouteComponentProps, Redirect, connect } from 'umi';
import { UserModelState } from '@/models/user';
import { getExperiment } from '@/services/index';
import { Table, Tag, Space, Button, Popconfirm } from 'antd';
import { experiment } from '@/type/index';

function SelectExperiment({ user, location }: IRouteComponentProps) {
  var state = location.state;
  var courseId = state.courseId;
  var classId = state.classId;
  if (!courseId || !classId) {
    return <Redirect to="/"></Redirect>
  }
  const [experiments, setExperiments] = useState([]);
  const [stuCount, setStuCount] = useState(0)
  useEffect(() => {
    getExperiment(courseId, classId, user.tid).then(data => {
      // 对数据进行加工一下
      var arr = data.experiments;
      arr = arr.map((item: experiment) => {
        item.finish = item.submitted == data.count
        return item;
      })
      setExperiments(arr);
      setStuCount(data.count);
    })
  }, [state])


  const columns = [
    {
      title: '实验报告名称',
      // dataIndex为展示的数据属性名
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: '提交情况',
      key: 'submitted',
      dataIndex: 'submitted',
      render: (count: Number, record: experiment) => (
        <>
          <span>{count} / {stuCount}</span>
          <Tag color={record.finish ? "green" : "red"} style={{ marginLeft: '5px' }}>{record.finish ? '已交齐' : '未交齐'}</Tag>
        </>
      ),
    },
    {
      title: '截止日期',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: string, record: any) => (
        <Space size="small">
          <Button size="small" style={{ fontSize: '12px' }}>查看</Button>
          <Button size="small" type="primary" style={{ fontSize: '12px' }}>修改</Button>
          <Popconfirm
            title="确认删除吗"
            onConfirm={() => deleteExperiment(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" type="primary" danger style={{ fontSize: '12px' }}>删除</Button>
          </Popconfirm>

        </Space>
      ),
    },
  ];
  const deleteExperiment = ({ uid, id }: experiment) => {
    // 发送请求，成功就消除前端数据
    
    var arr = experiments.filter((item: experiment) => {
      return !(item.id === id && item.uid === uid);
    })
    setExperiments(arr);
  }

  return (
    <div>
      <Table pagination={false} rowKey="id" columns={columns} dataSource={experiments} />
    </div>
  )
}
function mapStateToProps({ user }: { user: UserModelState }) {
  return {
    user
  }
}
export default connect(mapStateToProps)(SelectExperiment);