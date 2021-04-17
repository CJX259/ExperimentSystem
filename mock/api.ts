import { getCookie } from '../src/utils';
import { getStuData } from './index';
export default {
  'POST /api/teacher/login': (req: any, res: any) => {
    var name = req.query.name;
    var password = req.query.password;
    if (name == '蔡云鹭' && password == '123123') {
      // 设置登录成功cookie
      // 注意path，否则前端无法获取
      res.setHeader(
        'Set-Cookie',
        'userToken=asdasdasdajqwe1213; max-age=100000; path=/',
      );
      res.send({
        success: true,
        data: {
          name,
          tid: '1815200059',
          collegeId: '1',
          collegeName: '数学与信息科学学院',
        },
        msg: 'ok',
      });
    } else {
      res.send({ success: false, data: {}, msg: '账号或密码错误' });
    }
  },
  // 后端解析cookie，如果有内容，则返回对应用户信息
  // 如果无法解析cookie，即cookie有问题或已过期，则返回认证错误
  'GET /api/teacher/loginbycookie': (req: any, res: any) => {
    // 这里如果req没有cookie，则传一个无法匹配的cookie字符串，否则如果传空的话
    // getCookie方法就会用document.cookie方法了（因为他要适配其他地方）
    var cookie = req.headers.cookie || 'nothing';
    var needCookie = getCookie('userToken', cookie);
    if (needCookie != null) {
      res.send({
        success: true,
        data: {
          name: '蔡云鹭',
          tid: '1815200059',
          collegeId: '1',
          collegeName: '数学与信息科学学院',
        },
        msg: 'ok',
      });
    } else {
      res.send({ success: false, data: {}, msg: 'cookie认证错误' });
    }
  },
  // 拿到所有的class，真正来说不太科学，应该是老师同属学院的所有班级（但项目规模较小，若需要往后拓展，则需修改数据库结构）
  'GET /api/class/getallclass': (req: any, res: any) => {
    res.send({
      success: true,
      data: {
        classes: [
          { name: '信计181', id: '1' },
          { name: '信计182', id: '2' },
          { name: '数学183', id: '3' },
          { name: '数学184', id: '4' },
          { name: '基地185', id: '5' },
          { name: '基地186', id: '6' },
          { name: '精算187', id: '7' },
          { name: '金融188', id: '8' },
          { name: '金融189', id: '9' },
        ],
      },
      msg: 'OK',
    });
    // res.send({success: false, data: '', msg:"班级查询失败"});
  },
  // 通过cookie拿到老师信息，返回老师所教的课程
  'GET /api/course/getcoursesbyteacher': (req: any, res: any) => {
    res.send({
      success: true,
      data: {
        courses: [
          { name: '数据结构', id: '1' },
          { name: '面向对象设计', id: '2' },
          { name: 'javaweb', id: '3' },
          { name: '软件工程', id: '4' },
          { name: '操作系统', id: '5' },
          { name: '计算机网络', id: '6' },
        ],
      },
      msg: 'OK',
    });
    // res.send({success: false, data: '', msg:"课程查询失败"});
  },
  'POST /api/course/addcourse': (req: any, res: any) => {
    // 通过cookie，拿到老师id
    // 然后通过post上来的课程id和课程名和实验报告，生成各项数据
    res.send({ success: true, data: '', msg: '添加成功' });
    // res.send({success: false, data: '', msg:"添加失败"});
  },

  // 通过cid拿到该课程和老师对应的班级
  'GET /api/class/getclassbycourseid': (req: any, res: any) => {
    if (Math.random() > 0.5) {
      res.send({
        success: true,
        data: {
          classes: [
            { name: '信计181', id: '1' },
            { name: '信计182', id: '2' },
            { name: '数学183', id: '3' },
            { name: '数学184', id: '4' },
            { name: '基地185', id: '5' },
            { name: '基地186', id: '6' },
            { name: '精算187', id: '7' },
            { name: '金融188', id: '8' },
            { name: '金融189', id: '9' },
          ],
        },
        msg: 'OK',
      });
    } else {
      res.send({
        success: true,
        data: {
          classes: [
            { name: '信计181', id: '1' },
            { name: '信计182', id: '2' },
            { name: '数学183', id: '3' },
            { name: '数学184', id: '4' },
            { name: '基地185', id: '5' },
            { name: '基地186', id: '6' },
            { name: '精算187', id: '7' },
            { name: '金融188', id: '8' },
            { name: '金融189', id: '9' },
            { name: '信计181', id: '10' },
            { name: '信计182', id: '11' },
            { name: '数学183', id: '12' },
            { name: '数学184', id: '13' },
            { name: '基地185', id: '14' },
            { name: '基地186', id: '15' },
            { name: '精算187', id: '16' },
            { name: '金融188', id: '17' },
            { name: '金融189', id: '18' },
          ],
        },
        msg: 'OK',
      });
    }
  },

  // 通过课程id，班级id和老师id，拿到对应的实验报告名称和id
  'GET /api/experiment/getexperiments': (req: any, res: any) => {
    if (Math.random() > 0.5) {
      res.send({
        success: true,
        data: {
          // count是班级人数（即实验报告需要提交的人数）
          count: 60,
          experiments: [
            {
              uid: '1-2-1',
              name: '数据库的嵌套查询',
              id: '1',
              deadline: '2021-04-10',
              submitted: 60,
            },
            {
              uid: '1-2-1',
              name: '数据库的建立和维护',
              id: '2',
              deadline: '2021-04-20',
              submitted: 54,
            },
            {
              uid: '1-2-1',
              name: '简单查询和连接查询',
              id: '3',
              deadline: '2021-04-30',
              submitted: 44,
            },
            {
              uid: '1-2-1',
              name: '数据库的建立和维护',
              id: '4',
              deadline: '2021-05-1',
              submitted: 34,
            },
            {
              uid: '1-2-1',
              name: '简单查询和连接查询',
              id: '5',
              deadline: '2021-05-10',
              submitted: 24,
            },
          ],
        },
        msg: 'OK',
      });
    } else {
      res.send({
        success: true,
        data: {
          count: 60,
          experiments: [
            {
              uid: '1-1-1',
              name: '用例图设计',
              id: '1',
              deadline: '2021-04-11',
              submitted: 44,
            },
            {
              uid: '1-1-1',
              name: '类图设计',
              id: '2',
              deadline: '2021-04-17',
              submitted: 24,
            },
            {
              uid: '1-1-1',
              name: '系统建模与实现',
              id: '3',
              deadline: '2021-05-1',
              submitted: 2,
            },
          ],
        },
        msg: 'OK',
      });
    }
  },
  // 通过uid和实验报告id来删除实验报告
  'POST /api/experiment/delexperiment': (req: any, res: any) => {
    var uid = req.query.uid;
    var id = req.query.id;
    if (uid && id) {
      res.send({
        success: true,
        data: {},
        msg: 'ok',
      });
    } else {
      res.send({
        success: false,
        data: {},
        msg: '缺少参数',
      });
    }
  },

  //通过name，deadline，uid添加实验报告
  'POST /api/experiment/addexperiment': (req: any, res: any) => {
    if (Math.random() > 0.5) {
      var name = req.query.name;
      var deadline = req.query.deadline;
      var uid = req.query.uid;
      res.send({
        success: true,
        data: {
          experiments: [
            {
              uid,
              name,
              id: '1' + new Date().toLocaleString(),
              deadline,
              submitted: 0,
            },
          ],
        },
        msg: '添加成功',
      });
    } else {
      res.send({
        success: false,
        data: {},
        msg: '添加失败',
      });
    }
  },

  //通过uid+id，修改实验报告
  'POST /api/experiment/updateexperiment': (req: any, res: any) => {
    if (Math.random() > 0.7) {
      var name = req.query.name;
      var deadline = req.query.deadline;
      var uid = req.query.uid;
      var id = req.query.id;
      res.send({
        success: true,
        data: {
          experiments: [
            {
              name,
              uid,
              id,
              deadline,
              submitted: 0, //提交情况要后台重新拿一次
            },
          ],
        },
        msg: '修改成功',
      });
    } else {
      res.send({
        success: false,
        data: {},
        msg: '修改失败',
      });
    }
  },
  // 分页通过classId，exp信息拿到学生数据(join操作，再拿到finish表中学生的提交情况)
  // 可以添加参数进行筛选，没有接收到该参数就不对该值进行筛选
  // grade： “优秀”，“良好”，“及格”， “不及格”，“未评分”（未评分是找出grade为null的）
  // status：“0”， “1”
  // com_permit：“0”，“1”
  // name：暂定
  'GET /api/experiment/getstudatabypage': (req: any, res: any) => {
    var experiment = req.query.experiment;
    var classId = req.query.classId;
    // 转化为数字
    // res.send({success: false, data: {}, msg:"学生数据获取失败"});
    var current = +req.query.current || 1;
    var pageSize = +req.query.pageSize || 10;
    if (!classId || !experiment) {
      res.send({
        success: false,
        data: {},
        msg: '获取学生信息错误',
      });
    }
    var stus = students.slice(
      (current - 1) * pageSize,
      (current - 1) * pageSize + pageSize,
    );
    res.send({
      success: true,
      data: {
        count: 50,
        students: stus,
      },
      msg: 'OK',
    });
  },
};
const students = getStuData();
