import { request } from 'umi';
import { publicPath } from '../type/index';
export async function updatePassword(oldPassword: string, newPassword: string) {
  try {
    const data = await request(`${publicPath}api/teacher/updatepassword`, {
      method: 'POST',
      skipErrorHandler: true,
      params: {
        oldPassword,
        newPassword,
      },
    });
    if (data.success) {
      return data;
    } else {
      throw new Error(data.msg);
    }
  } catch (err) {
    throw new Error(err.message);
  }
}
