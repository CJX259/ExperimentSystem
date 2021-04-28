import { Reducer, Effect } from 'umi';
import { message } from 'antd';
import { getCoursesByTeacher } from '@/services/course';

export interface Course {
  uid: string;
  name: string;
}
export interface CourseModelState {
  courses: Array<Course>;
}

export interface CourseModelType {
  state: CourseModelState;
  reducers: {
    setCourses: Reducer;
  };
  effects: {
    getCourseByCookie: Effect;
  };
}
const CourseModel: CourseModelType = {
  state: {
    courses: [],
  },
  reducers: {
    setCourses(state: CourseModelState, action): CourseModelState {
      let { payload: courses } = action;
      return {
        courses,
      };
    },
  },
  effects: {
    *getCourseByCookie(action, { call, put }) {
      try {
        const data = yield call([this, getCoursesByTeacher]);
        // 返回的直接就是数据
        yield put({ type: 'setCourses', payload: data });
      } catch (err) {
        message.error(err.message);
      }
    },
  },
};

export default CourseModel;
