import { message } from 'antd';
import { request } from 'umi';

export async function getExperiment(courseId: string, classUid: string) {
  try {
    const data = await request('/api/experiment/getexperiments', {
      method: 'GET',
      skipErrorHandler: true,
      params: {
        courseId,
        classUid,
      },
    });
    if (data.success) {
      return data.data;
    } else {
      // message.error(data.msg || '获取实验报告错误');
      // return data.msg;
      // 这里的错误信息被下面的catch捕获。（为了整合http错误和服务器设定的错误）
      throw new Error(data.msg);
    }
  } catch (err) {
    throw new Error(err);
  }
}

export async function delExperiment(id: string) {
  try {
    const data = await request('/api/experiment/delexperiment', {
      method: 'POST',
      skipErrorHandler: true,
      params: {
        id,
      },
    });
    if (data.success) {
      return data;
    } else {
      // message.error(data.msg || '删除实验报告错误');
      // return data.success;
      throw new Error(data.msg);
    }
  } catch (err) {
    throw new Error(err);
  }
}

export async function addExperiment(
  uid: string,
  name: string,
  deadline: string,
) {
  try {
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
      // message.error(data.msg || '添加实验报告错误');
      // return data;
      throw new Error(data.msg);
    }
  } catch (err) {
    throw new Error(err);
  }
}

export async function updateExperiment(
  id: string,
  name: string,
  deadline: string,
) {
  try {
    const data = await request('/api/experiment/updateexperiment', {
      method: 'POST',
      skipErrorHandler: true,
      params: {
        id,
        name,
        deadline,
      },
    });
    if (data.success) {
      message.success(data.msg);
      return data;
    } else {
      // message.error(data.msg || '修改实验报告错误');
      // return data;
      throw new Error(data.msg);
    }
  } catch (err) {
    throw new Error(err);
  }
}

// 只传路径
export async function downloadExperiment(experPath: string) {
  try {
    const data = await request('/api/experiment/download', {
      method: 'GET',
      params: {
        experPath,
      },
      skipErrorHandler: true,
    });
    if (data.success) {
      return data;
    } else {
      throw new Error(data.msg);
    }
  } catch (err) {
    throw new Error(err);
  }
}
