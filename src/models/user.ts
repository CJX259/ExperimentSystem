import { history, Effect, Reducer, request } from 'umi';
import { message } from 'antd';
import { publicPath } from '../type/index';
import { delCookie } from '@/utils';
// state类型接口
export interface UserModelState {
  name: string;
  tid: string;
  collegeId: string;
  collegeName: string;
}
// model配置的接口样式
export interface UserModelType {
  state: UserModelState;
  effects: {
    login: Effect;
    loginbycookie: Effect;
    logout: Effect;
  };
  reducers: {
    setUser: Reducer;
  };
}
// 定义UserModel
const UserModel: UserModelType = {
  state: {
    name: '',
    tid: '',
    collegeId: '',
    collegeName: '',
  },
  // 副作用函数，内部由react-saga实现
  // 无法抛出错误到页面接收，只能在这里处理
  effects: {
    *login(action, { call, put }) {
      try {
        let data = yield call(
          [this, requestLogin],
          action.payload.teacherId,
          action.payload.password,
        );
        if (data.success) {
          // yield put({ type: 'setUser', payload: data.data });
          message.success(data.msg, 1);
          history.push('/');
        } else {
          // 登录失败的情况
          throw new Error(data.msg);
        }
      } catch (err) {
        message.error(err.message);
      }
    },
    *loginbycookie(action, { call, put }) {
      try {
        let data = yield call([this, requestLoginByCookie]);
        if (data.success) {
          yield put({ type: 'setUser', payload: data.data });
          // 登录成功后，请求公告和课程
          yield put({ type: 'course/getCourseByCookie' });
          yield put({ type: 'announcement/getAllAnnouncements' });
        } else {
          yield put({ type: 'setUser', payload: {} });
          // 删除原来的cookie
          delCookie('userToken');
          throw new Error(data.msg);
        }
      } catch (err) {
        message.error(err.message);
        history.push('/login1');
      }
    },
    *logout(action, { call, put }) {
      message.success('登出成功', 1);
      yield put({ type: 'setUser', payload: {} });
      // 删除原来的cookie
      delCookie('userToken');
      history.push('/login1');
    },
  },
  // dispatch这里reducers的函数名即可触发对应函数
  // 如dispatch(action:{type: 'setUser', payload:{}})
  reducers: {
    setUser(state: UserModelState, action): UserModelState {
      var name = action.payload.name ? action.payload.name : '';
      var tid = action.payload.tid ? action.payload.tid : '';
      var collegeId = action.payload ? action.payload.collegeId : '';
      var collegeName = action.payload ? action.payload.collegeName : '';
      return {
        ...state,
        name,
        tid: tid,
        collegeId,
        collegeName,
      };
    },
  },
};

async function requestLogin(teacherId: string, password: string) {
  const data = await request(`${publicPath}api/teacher/login`, {
    method: 'post',
    params: {
      teacherId,
      password: password,
    },
    skipErrorHandler: true,
  });
  return data;
}
async function requestLoginByCookie() {
  const data = await request(`${publicPath}api/teacher/loginbycookie`, {
    method: 'get',
    skipErrorHandler: true,
  });
  return data;
}

export default UserModel;
