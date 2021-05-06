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
  courseUid: string,
  uid: string,
  classUid: string,
  name: string,
  deadline: string,
) {
  try {
    const data = await request('/api/experiment/addexperiment', {
      method: 'POST',
      skipErrorHandler: true,
      params: {
        courseUid,
        uid,
        classUid,
        name,
        deadline,
      },
    });
    if (data.success) {
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
  submitted: number,
) {
  try {
    const data = await request('/api/experiment/updateexperiment', {
      method: 'POST',
      skipErrorHandler: true,
      params: {
        id,
        name,
        deadline,
        submitted,
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

export async function downloadExperiment(
  studentId: string,
  experimentId: string,
) {
  try {
    const a = document.createElement('a');
    a.setAttribute(
      'href',
      `/api/experiment/download?&studentId=${studentId}&experimentId=${experimentId}`,
    );
    a.click();
  } catch (err) {
    throw new Error(err);
  }
}

export async function polyDownloadExperiment(
  experimentId: string,
  studentsId: Array<string>,
) {
  try {
    const a = document.createElement('a');
    let url = `/api/experiment/polydownload?experimentId=${experimentId}`;
    studentsId.forEach((id: string) => {
      url += `&studentId=${id}`;
    });
    a.setAttribute('href', url);
    a.click();
  } catch (err) {
    throw new Error(err);
  }
}
