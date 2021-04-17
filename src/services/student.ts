import { request } from 'umi';
import { experiment } from '@/type';
// 分页拿到某个班的学生(需传exp信息，拿到finish表内容拼接)
export async function getStuByClassByPage(
  classId: string,
  experiment: experiment,
  current: number,
  pageSize: number,
  filters?: any,
) {
  try {
    const data = await request('/api/experiment/getstudatabypage', {
      method: 'GET',
      params: {
        experiment,
        classId,
        current,
        pageSize,
        ...filters,
      },
      skipErrorHandler: true,
    });
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.msg);
    }
  } catch (err) {
    throw new Error(err);
  }
}
