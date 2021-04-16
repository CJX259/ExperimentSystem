import { message } from 'antd';
import { request } from 'umi';

export async function getExperiment(
  courseId: string,
  classId: string,
  tid: string,
) {
  const data = await request('/api/experiment/getexperiments', {
    method: 'GET',
    skipErrorHandler: true,
    params: {
      courseId,
      classId,
      tid,
    },
  });
  if (data.success) {
    return data.data;
  } else {
    message.error(data.msg || '获取实验报告错误');
    return {};
  }
}

export async function delExperiment(uid: string, id: string) {
  const data = await request('/api/experiment/delexperiment', {
    method: 'POST',
    skipErrorHandler: true,
    params: {
      uid,
      id,
    },
  });
  if (data.success) {
    message.success('删除成功');
    return data.success;
  } else {
    message.error(data.msg || '删除实验报告错误');
    return data.success;
  }
}

export async function addExperiment(
  uid: string,
  name: string,
  deadline: string,
) {
  const data = await request('/api/experiment/addexperiment', {
    method: 'POST',
    skipErrorHandler: true,
    params: {
      uid,
      name,
      deadline,
    },
  });
  if (data.success) {
    message.success(data.msg);
    return data;
  } else {
    message.error(data.msg || '添加实验报告错误');
    return data;
  }
}

export async function updateExperiment(
  uid: string,
  id: string,
  name: string,
  deadline: string,
) {
  const data = await request('/api/experiment/updateexperiment', {
    method: 'POST',
    skipErrorHandler: true,
    params: {
      uid,
      id,
      name,
      deadline,
    },
  });
  if (data.success) {
    message.success(data.msg);
    return data;
  } else {
    message.error(data.msg || '修改实验报告错误');
    return data;
  }
}
