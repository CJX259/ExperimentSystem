import { request } from 'umi';
// 通过学院id，拿到该学院的所有班级
export async function getAllClass() {
  try {
    const data = await request('/api/class/getallclass', {
      method: 'GET',
      skipErrorHandler: true,
    });
    if (data.success) {
      return data.data.classes;
    } else {
      // message.error(data.msg || '获取班级信息错误');
      // return [];
      throw new Error(data.msg || '获取班级信息错误');
    }
  } catch (err) {
    throw new Error(err);
  }
}
export async function getClassByCourseId(courseId: string) {
  try {
    const data = await request('/api/class/getclassbycourseid', {
      method: 'GET',
      skipErrorHandler: true,
      params: {
        courseId,
      },
    });
    if (data.success) {
      return data.data;
    } else {
      // message.error(data.msg || '获取班级信息错误');
      // return [];
      throw new Error(data.msg || '获取班级信息错误');
    }
  } catch (err) {
    throw new Error(err);
  }
}
