import { history, Effect, Reducer, request } from 'umi';
import { message } from 'antd';
import { delCookie } from '@/utils';
// state类型接口
export interface UserModelState {
  name: string;
  tid: string;
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
  },
  // 副作用函数，内部由react-saga实现
  effects: {
    *login(action, { call, put }) {
      let data = yield call(
        [this, requestLogin],
        action.payload.name,
        action.payload.password,
      );
      if (data.success) {
        message.success('登录成功', 1);
        yield put({ type: 'setUser', payload: data.data });
      } else {
        // 登录失败的情况
        message.error(data.msg);
      }
    },
    *loginbycookie(action, { call, put }) {
      let data = yield call([this, requestLoginByCookie]);
      if (data.success) {
        yield put({ type: 'setUser', payload: data.data });
      } else {
        message.error(data.msg, 1);
        yield put({ type: 'setUser', payload: { name: '', tid: '' } });
        // 删除原来的cookie
        delCookie('userToken');
        history.push('/login');
      }
    },
    *logout(action, { call, put }) {
      message.success('登出成功', 1);
      yield put({ type: 'setUser', payload: { name: '', tid: '' } });
      // 删除原来的cookie
      delCookie('userToken');
      history.push('/login');
    },
  },
  // dispatch这里reducers的函数名即可触发对应函数
  // 如dispatch(action:{type: 'setUser', payload:{}})
  reducers: {
    setUser(state: UserModelState, action): UserModelState {
      var name = action.payload.name ? action.payload.name : state.name;
      var tid = action.payload.tid ? action.payload.tid : state.tid;
      return {
        ...state,
        name,
        tid: tid,
      };
    },
  },
};
// 模拟等待请求
async function requestLogin(name: string, password: string) {
  const data = await request('/api/teacher/login', {
    method: 'post',
    params: {
      name: name,
      password: password,
    },
    skipErrorHandler: true,
  });
  return data;
}
async function requestLoginByCookie() {
  try {
    const data = await request('/api/teacher/loginbycookie', {
      method: 'get',
      skipErrorHandler: true,
    });
    return data;
  } catch (err) {
    return { success: false, data: {}, msg: err };
  }
}

export default UserModel;
