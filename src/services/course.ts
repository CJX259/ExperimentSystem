import { request } from 'umi';
export async function getByCoursesTeacher() {
  try {
    const data = await request('/api/course/getcoursesbyteacher', {
      method: 'GET',
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
