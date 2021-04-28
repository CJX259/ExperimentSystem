import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import { getAnnouncement } from '@/services/announcement';
export interface announcement {
  id: string;
  content: string;
}
export interface AnnouncementModelState {
  announcements: Array<announcement>;
}

export interface AnnouncementModelType {
  state: AnnouncementModelState;
  effects: {
    getAllAnnouncements: Effect;
  };
  reducers: {
    setAnnouncements: Reducer;
  };
}

const AnnouncementModel: AnnouncementModelType = {
  state: {
    announcements: [],
  },
  effects: {
    *getAllAnnouncements(action, { call, put }) {
      try {
        const data = yield call([this, getAnnouncement]);
        if (data.success) {
          yield put({ type: 'setAnnouncements', payload: data.data.contents });
        }
      } catch (err) {
        message.error(err.message);
      }
    },
  },
  reducers: {
    setAnnouncements(
      state: AnnouncementModelState,
      action,
    ): AnnouncementModelState {
      var announcements = action.payload;
      return {
        ...state,
        announcements,
      };
    },
  },
};
export default AnnouncementModel;
