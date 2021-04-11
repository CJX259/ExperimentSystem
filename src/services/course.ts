import {message } from 'antd';
import {request} from 'umi';
export async function getByCoursesTeacher() {
  const data = await request('/api/course/getcoursesbyteacher', {
    method: 'GET'
  })
  if (data.success) {
    return data.data.courses;
  } else {
    message.error(data.msg);
    return [];
  }
}

