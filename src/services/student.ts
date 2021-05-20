import { request } from 'umi';
import { experiment } from '@/type';
// 分页拿到某个班的学生(需传exp信息，拿到finish表内容拼接)
export async function getStuByClassByPage(
  classUid: string,
  experimentId: string,
  current: number,
  pageSize: number,
  filters?: any,
) {
  var newFilter: any = {};
  for (const key in filters) {
    if (Object.prototype.hasOwnProperty.call(filters, key)) {
      const filter = filters[key];
      if (filter) {
        newFilter[key] = filter;
      }
    }
  }
  try {
    const data = await request('/api/student/getstudatabypage', {
      method: 'GET',
      params: {
        experimentId,
        classUid,
        current,
        pageSize,
        ...newFilter,
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
export async function changePermit(
  experimentId: string,
  studentId: string,
  com_permit: number,
) {
  try {
    const data = await request('/api/student/changepermit', {
      method: 'POST',
      params: {
        experimentId,
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

export async function uploadGrade(
  experimentId: string,
  studentId: string,
  grade: string,
) {
  try {
    const data = await request('/api/student/uploadgrade', {
      method: 'POST',
      params: {
        experimentId,
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
// 评总分
export async function uploadScore(
  courseId: string,
  studentId: string,
  score: string,
) {
  try {
    const data = await request('/api/student/uploadscore', {
      method: 'POST',
      params: {
        courseId,
        studentId,
        score,
      },
      skipErrorHandler: true,
    });
    if (data.success) {
      return data;
    } else {
      throw new Error(data.msg);
    }
  } catch (err) {
    throw new Error(err.message);
  }
}
export async function uploadIsShow(
  experimentId: string,
  studentId: string,
  isShow: number,
) {
  try {
    const data = await request('/api/student/uploadisshow', {
      method: 'POST',
      params: {
        experimentId,
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
export async function getStudentAndExperimentByPage(
  courseId: string,
  classUid: string,
  pageSize: number,
  current: number,
  filters?: any,
) {
  try {
    const data = await request('/api/student/getstudentandexperimentbypage', {
      skipErrorHandler: true,
      method: 'GET',
      params: {
        courseId,
        classUid,
        pageSize,
        current,
        ...filters,
      },
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
