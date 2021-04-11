import {message } from 'antd';
import {request} from 'umi';
export async function getAllClass() {
  const data = await request('/api/class/getallclass', {
    method: 'GET',
    skipErrorHandler: true
  })
  if (data.success) {
    return data.data.classes;
  } else {
    message.error(data.msg);
    return [];
  }

}
export async function getClassByCourseId(courseId: string, tid: string) {
  const data = await request('/api/class/getclassbycourseid', {
    method: 'GET',
    skipErrorHandler: true,
    params: {
      courseId,
      tid
    }
  })
  if (data.success) {
    return data.data.classes;
  } else {
    message.error(data.msg);
    return [];
  }
}
