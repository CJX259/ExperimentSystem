import React, { useEffect, useState } from 'react';
import { IRouteComponentProps, Redirect, Link } from 'umi';
import { getExperiment, delExperiment } from '@/services/experiment';
import { Table, Tag, Space, Button, Popconfirm, Modal, message } from 'antd';
import { experiment } from '@/type/index';
import AddExperiment from '@/components/addExperiment';
import UpdateExperiment from '@/components/updateExperiment';
function SelectExperiment({ location }: IRouteComponentProps) {
  var state = location.state;
  var courseId = state.courseId;
  var classUid = state.classUid;
  if (!courseId || !classUid) {
    return <Redirect to="/"></Redirect>;
  }
  const [addVisible, setAddVisible] = useState(false);
  const [uid, setUid] = useState('');
  const [updateVisible, setUpdateVisible] = useState(false);
  const [updateExperiment, setUpdateExperiment] = useState({} as experiment);
  const [experiments, setExperiments] = useState([]);
  const [stuCount, setStuCount] = useState(0);
  useEffect(() => {
    getExperiment(courseId, classUid)
      .then((data) => {
        // 对数据进行加工一下
        var arr = data.experiments;
        arr = arr.map((item: experiment) => {
          item.finish = item.submitted == data.count;
          return item;
        });
        setExperiments(arr);
        setUid(arr[0].uid);
        setStuCount(data.count);
      })
      .catch((err) => {
        message.error(err.message);
      });
  }, [state]);

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
          <span>
            {count} / {stuCount}
          </span>
          <Tag
            color={record.finish ? 'green' : 'red'}
            style={{ marginLeft: '5px' }}
          >
            {record.finish ? '已交齐' : '未交齐'}
          </Tag>
        </>
      ),
    },
    {
      title: '截止日期',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (date: string) => (
        <>
          <span>{date}</span>
          <Tag
            color={new Date(date) >= new Date() ? 'green' : 'red'}
            style={{ marginLeft: '5px' }}
          >
            {new Date(date) >= new Date() ? '未过期' : '已到期'}
          </Tag>
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: string, record: experiment) => (
        <Space size="small">
          <Button size="small" style={{ fontSize: '12px' }}>
            <Link
              to={{
                pathname: '/detailexperiment',
                state: {
                  ...state,
                  experiment: record,
                },
              }}
            >
              查看
            </Link>
          </Button>
          <Button
            size="small"
            type="primary"
            style={{ fontSize: '12px' }}
            onClick={() => clickUpdate(record)}
          >
            修改
          </Button>
          <Popconfirm
            title="确认删除吗"
            onConfirm={() => deleteExperiment(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              type="primary"
              danger
              style={{ fontSize: '12px' }}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const deleteExperiment = async ({ id }: experiment): Promise<void> => {
    // 发送请求，成功就消除前端数据
    const success = await delExperiment(id);
    if (success) {
      var arr = experiments.filter((item: experiment) => {
        return !(item.id === id && item.uid === uid);
      });
      setExperiments(arr);
    }
  };
  // 更新前端的实验列表
  function addExperimentInWeb(experiment: never): void {
    setExperiments([...experiments, experiment]);
  }
  function clickAdd(): void {
    setAddVisible(true);
  }
  function cancelAdd(): void {
    setAddVisible(false);
  }
  function cancelUpdate(): void {
    setUpdateVisible(false);
  }
  // 点击更新按钮，传递需要更新的实验报告数据
  function clickUpdate(experiment: experiment): void {
    setUpdateExperiment(experiment);
    setUpdateVisible(true);
  }
  // 修改前端的实验列表
  function updateExperimentInWeb(newExperiment: experiment): void {
    // 找到id相同的实验，替换成新的
    var arr = experiments.map((item: experiment) => {
      if (item.id === newExperiment.id) {
        return newExperiment;
      } else {
        return item;
      }
    });
    setExperiments(arr as any);
    // 重置updateExperiment
    setUpdateExperiment({} as experiment);
  }
  return (
    <div>
      <Table
        pagination={false}
        rowKey="id"
        columns={columns}
        dataSource={experiments}
      />
      <Button
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '10px',
        }}
        onClick={() => clickAdd()}
      >
        添加实验报告
      </Button>
      <Modal
        title="添加实验报告"
        visible={addVisible}
        onCancel={cancelAdd}
        footer={null}
      >
        <AddExperiment
          experiments={experiments}
          uid={uid}
          updateExperiments={addExperimentInWeb}
          hidden={(flag: boolean) => setAddVisible(flag)}
        ></AddExperiment>
      </Modal>
      <Modal
        title="修改实验报告"
        visible={updateVisible}
        onCancel={cancelUpdate}
        footer={null}
      >
        <UpdateExperiment
          data={updateExperiment}
          experiments={experiments}
          updateExperiments={updateExperimentInWeb}
          hidden={(flag: boolean) => setUpdateVisible(flag)}
        ></UpdateExperiment>
      </Modal>
    </div>
  );
}
export default SelectExperiment;
