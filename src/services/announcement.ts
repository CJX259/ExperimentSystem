import { request } from 'umi';
import { publicPath } from '../type/index';
export async function getAnnouncement() {
  try {
    const data = await request(
      `${publicPath}api/announcement/getannouncement`,
      {
        method: 'GET',
        skipErrorHandler: true,
      },
    );
    if (data.success) {
      return data;
    } else {
      throw new Error(data.msg);
    }
  } catch (err) {
    throw new Error(err.message);
  }
}
