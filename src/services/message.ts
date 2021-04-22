import { request } from 'umi';
// 通过experimentId和classUid中的所有stuId，拿到finish表的数据，拿到提交状态，筛选出未提交的学生
// 给未提交的学生发送信息（插入信息到message表中）
export async function remindSubmit(
  teacherId: string,
  classUid: string,
  experimentId: string,
) {
  try {
    const data = await request('/api/message/remindsubmit', {
      method: 'POST',
      params: {
        teacherId,
        classUid,
        experimentId,
      },
      skipErrorHandler: true,
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
