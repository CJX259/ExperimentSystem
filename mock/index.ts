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
        experPath:
          'http://127.0.0.1:8080/%E7%B1%BB%E5%9B%BE%E8%AE%BE%E8%AE%A1.pdf',
      },
    ],
  });
  return data.students;
}
