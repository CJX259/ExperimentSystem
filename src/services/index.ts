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

export async function getExperiment(courseId: string, classId: string, tid: string){
  const data = await request('/api/experiment/getexperiments/', {
    method: "GET",
    skipErrorHandler: true,
    params: {
      courseId,
      classId,
      tid
    }
  })
  if(data.success){
    return data.data;
  }else{
    message.error(data.msg);
    return {};
  }
}