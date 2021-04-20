const mockjs = require('mockjs');
const Random = mockjs.Random;

Random.extend({
  grade: function () {
    const grades = ['1', '2', '3', '4', '0'];
    return this.pick(grades);
  },
});
export function getStuData() {
  // 使用 mockjs 等三方库
  const data = mockjs.mock({
    'students|60': [
      {
        'id|+1': 1,
        name: '@cname',
        'status|0-1': 1,
        grade: () => Random.grade(),
        'count|0-50': 1,
        'isShow|0-1': 1,
        'com_permit|0-1': 1,
        experPath: 'E:作业大三下面向对象',
      },
    ],
  });
  return data.students;
}
