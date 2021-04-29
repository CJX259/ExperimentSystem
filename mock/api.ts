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
      setTimeout(() => {
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
      }, 500);
    } else {
      res.send({ success: false, data: {}, msg: 'cookie认证错误' });
    }
  },
  // 拿到老师同属学院的所有班级
  'GET /api/class/getallclass': (req: any, res: any) => {
    res.send({
      success: true,
      data: {
        classes: [
          { name: '信计181', uid: '1', grade: '2019' },
          { name: '信计182', uid: '2', grade: '2020' },
          { name: '数学183', uid: '3', grade: '2019' },
          { name: '数学184', uid: '4', grade: '2018' },
          { name: '基地185', uid: '5', grade: '2019' },
          { name: '基地186', uid: '6', grade: '2018' },
          { name: '精算187', uid: '7', grade: '2020' },
          { name: '金融188', uid: '8', grade: '2018' },
          { name: '金融189', uid: '9', grade: '2018' },
        ],
      },
      msg: 'OK',
    });
    // res.send({success: false, data: '', msg:"班级查询失败"});
  },
  // 通过cookie，拿到老师对应的学院，然后返回属于该学院的课程
  'GET /api/course/getcourses': (req: any, res: any) => {
    res.send({
      success: true,
      data: {
        courses: [
          { name: '数据结构', uid: '1' },
          { name: '面向对象设计', uid: '2' },
          { name: 'javaweb', uid: '3' },
          { name: '软件工程', uid: '4' },
          { name: '操作系统', uid: '5' },
          { name: '计算机网络', uid: '6' },
        ],
      },
      msg: 'OK',
    });
  },
  // 通过cookie拿到老师信息，返回老师所教的课程
  'GET /api/course/getcoursesbyteacher': (req: any, res: any) => {
    var cookie = req.headers.cookie || 'nothing';
    var needCookie = getCookie('userToken', cookie);
    if (needCookie != null) {
      res.send({
        success: true,
        data: {
          courses: [
            { name: '数据结构', uid: '1' },
            { name: '面向对象设计', uid: '2' },
            { name: 'javaweb', uid: '3' },
            { name: '软件工程', uid: '4' },
            { name: '操作系统', uid: '5' },
            { name: '计算机网络', uid: '6' },
          ],
        },
        msg: 'OK',
      });
    } else {
      res.send({ success: false, data: '', msg: '课程查询失败' });
    }
  },
  'POST /api/course/addcourse': (req: any, res: any) => {
    // console.log(req.query);
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
          grades: ['2018', '2019', '2020'],
          classes: [
            { name: '信计181', uid: '1', grade: '2018' },
            { name: '信计182', uid: '2', grade: '2018' },
            { name: '数学183', uid: '3', grade: '2018' },
            { name: '数学194', uid: '4', grade: '2019' },
            { name: '基地195', uid: '5', grade: '2019' },
            { name: '基地201', uid: '6', grade: '2020' },
            { name: '精算202', uid: '7', grade: '2020' },
            { name: '金融198', uid: '8', grade: '2019' },
            { name: '金融189', uid: '9', grade: '2018' },
          ],
        },
        msg: 'OK',
      });
    } else {
      res.send({
        success: true,
        data: {
          grades: ['2018', '2019', '2020'],
          classes: [
            { name: '信计181', uid: '1', grade: '2018' },
            { name: '信计182', uid: '2', grade: '2018' },
            { name: '数学183', uid: '3', grade: '2018' },
            { name: '数学194', uid: '4', grade: '2019' },
            { name: '基地195', uid: '5', grade: '2019' },
            { name: '基地201', uid: '6', grade: '2020' },
            { name: '精算202', uid: '7', grade: '2020' },
            { name: '金融198', uid: '8', grade: '2019' },
            { name: '金融189', uid: '9', grade: '2018' },
            { name: '基地195', uid: '10', grade: '2019' },
            { name: '基地201', uid: '11', grade: '2020' },
            { name: '精算202', uid: '12', grade: '2020' },
            { name: '金融198', uid: '13', grade: '2019' },
            { name: '金融189', uid: '14', grade: '2018' },
            { name: '基地195', uid: '15', grade: '2019' },
            { name: '基地195', uid: '16', grade: '2019' },
            { name: '基地195', uid: '17', grade: '2019' },
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
              deadline: '2021-05-01',
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
    var id = req.query.id;
    if (id) {
      res.send({
        success: true,
        data: {},
        msg: '删除成功',
      });
    } else {
      res.send({
        success: false,
        data: {},
        msg: '缺少参数',
      });
    }
  },

  //通过name，deadline，uid, classUid添加实验报告
  'POST /api/experiment/addexperiment': (req: any, res: any) => {
    var name = req.query.name;
    var deadline = req.query.deadline;
    var uid = req.query.uid;
    res.send({
      success: true,
      data: {
        experiments: [
          {
            // 返回同一个uid
            uid,
            name,
            // 随机id
            id: '1' + new Date().toLocaleString(),
            deadline,
            submitted: 0,
          },
        ],
      },
      msg: '添加成功',
    });
    // res.send({
    //   success: false,
    //   data: {},
    //   msg: '添加失败',
    // });
  },

  //通过id，修改实验报告,后台可以不用接收uid，但是要返回uid（add要用）
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
  // 分页通过classId，exp信息拿到学生数据
  // 可以添加参数进行筛选，没有接收到该参数就不对该值进行筛选
  // grade： 0、1、2、3、4
  // status：0、1、或不传
  // com_permit：0、1、或不传
  // current：当前页，从1开始
  // pageSize：一页的学生数据数量
  // experimentId：当前experimentId
  // classUiD：当前班级的uid
  // name：暂定
  'GET /api/student/getstudatabypage': (req: any, res: any) => {
    var experimentId = req.query.experimentId;
    var classUid = req.query.classUid;
    // res.send({success: false, data: {}, msg:"学生数据获取失败"});
    var current = +req.query.current || 1;
    var pageSize = +req.query.pageSize || 10;
    if (!classUid || !experimentId) {
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
        // 'students': [
        //   {
        //     id: 1,
        //     name: 'cjx',
        //     status: 1,
        //     grade: 0,
        //     count: 1,
        //     isShow: 1,
        //     com_permit: 1,
        //     experPath:
        //       'http://127.0.0.1:8080/%E7%B1%BB%E5%9B%BE%E8%AE%BE%E8%AE%A1.pdf',
        //   },
        //   {
        //     id: 2,
        //     name: 'cjx2',
        //     status: 0,
        //     grade: 0,
        //     count: 12,
        //     isShow: 0,
        //     com_permit: 0,
        //     experPath:
        //       'http://127.0.0.1:8080/%E7%B1%BB%E5%9B%BE%E8%AE%BE%E8%AE%A1.pdf',
        //   },
        // ],
      },
      msg: 'OK',
    });
  },

  // 修改学生的开启/关闭通道
  // 参数experimentId, studentId和com_permit
  'POST /api/student/changepermit': (req: any, res: any) => {
    res.send({
      success: true,
      data: {},
      msg: 'OK',
    });
    // res.send({
    //   success:false,
    //   data: {},
    //   msg: '修改失败'
    // })
  },
  // 修改分数，以及修改是否展示（isShow）
  // 参数：experimentId,studentId，grade，
  'POST /api/student/uploadgrade': (req: any, res: any) => {
    res.send({
      success: true,
      data: {},
      msg: 'OK',
    });
    // res.send({
    //   success:false,
    //   data: {},
    //   msg: '修改失败'
    // })
  },
  // 修改isShow
  // 参数：experimentId,studentId，isShow
  'POST /api/student/uploadisshow': (req: any, res: any) => {
    res.send({
      success: true,
      data: {},
      msg: 'OK',
    });
    // res.send({
    //   success:false,
    //   data: {},
    //   msg: '修改失败'
    // })
  },
  'GET /api/experiment/download': (req: any, res: any) => {
    res.send({
      success: true,
      data: {},
      msg: 'OK',
    });
  },

  // message部分
  // 提醒该experiment的班级的学生提交实验报告
  // 通过experimentId和classUid中的所有stuId，拿到finish表的数据，拿到提交状态，筛选出未提交的学生
  // 给未提交的学生发送信息（插入信息到message表中）
  'POST /api/message/remindsubmit': (req: any, res: any) => {
    res.send({
      success: true,
      data: {},
      msg: '提醒成功',
    });
    // res.send({
    //   success: false,
    //   data: {},
    //   msg: '提醒失败'
    // })
  },
  'GET /api/announcement/getannouncement': (req: any, res: any) => {
    var cookie = req.headers.cookie || 'nothing';
    // 后端通过cookie判断一下session有无过期，没有过期就拿所有的公告即可
    // 目的是防止未登录直接进主页面的时候还能拿到公告
    var needCookie = getCookie('userToken', cookie);
    if (needCookie != null) {
      res.send({
        success: true,
        data: {
          contents: [
            { id: 1, content: '这是公告1' },
            {
              id: 2,
              content: '这是公告2',
            },
          ],
        },
      });
    } else {
      res.send({
        success: false,
        data: {},
        msg: '未登录',
      });
    }
  },
};
const students = getStuData();
