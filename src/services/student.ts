import { request } from 'umi';
import { experiment } from '@/type';
// 分页拿到某个班的学生(需传exp信息，拿到finish表内容拼接)
export async function getStuByClassByPage(
  classId: string,
  experiment: experiment,
  current: number,
  pageSize: number,
  filters?: any,
) {
  try {
    const data = await request('/api/student/getstudatabypage', {
      method: 'GET',
      params: {
        experiment,
        classId,
        current,
        pageSize,
        ...filters,
      },
      skipErrorHandler: true,
    });
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.msg);
    }
  } catch (err) {
    throw new Error(err);
  }
}
export async function changePermit(studentId: string, com_permit: string) {
  try {
    const data = await request('/api/student/changepermit', {
      method: 'POST',
      params: {
        studentId,
        com_permit,
      },
      skipErrorHandler: true,
    });
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.msg);
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function uploadGrade(studentId: string, grade: string) {
  try {
    const data = await request('/api/student/uploadgrade', {
      method: 'POST',
      params: {
        studentId,
        grade,
      },
      skipErrorHandler: true,
    });
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.msg);
    }
  } catch (err) {
    throw new Error(err.message);
  }
}
export async function uploadIsShow(studentId: string, isShow: string) {
  try {
    const data = await request('/api/student/uploadisshow', {
      method: 'POST',
      params: {
        studentId,
        isShow,
      },
      skipErrorHandler: true,
    });
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.msg);
    }
  } catch (err) {
    throw new Error(err.message);
  }
}
