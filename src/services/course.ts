import { request } from 'umi';
export async function getCoursesByTeacher() {
  try {
    const data = await request('/api/course/getcoursesbyteacher', {
      method: 'GET',
      skipErrorHandler: true,
    });
    if (data.success) {
      return data.data.courses;
    } else {
      // message.error(data.msg || '获取课程信息错误');
      // return [];
      throw new Error(data.msg);
    }
  } catch (err) {
    throw new Error(err);
  }
}

// 通过学院id，然后返回该学院的课程
export async function getCoursesByCollege() {
  try {
    const data = await request('/api/course/getcourses', {
      method: 'GET',
    });
    if (data.success) {
      return data.data.courses;
    } else {
      throw new Error(data.msg);
    }
  } catch (err) {
    throw new Error(err);
  }
}
// 添加老师教课信息
export async function addCourse(values: any) {
  try {
    const data = await request('/api/course/addcourse', {
      method: 'POST',
      params: values,
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
