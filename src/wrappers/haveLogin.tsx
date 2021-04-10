import { Redirect } from 'umi';
/**
 * 检测当前浏览器有没有cookie,没有则跳转到login
 */

var cookiesName = ['userToken'];
export default function (props: any) {
  if(props.location.pathname == '/login'){
    return <div>{props.children}</div>;
  }
  var flag = false;
  for (var i = 0; i < cookiesName.length; i++) {
    var cookieName = cookiesName[i];
    if (document.cookie.indexOf(cookieName) !== -1) {
      //找到了，返回1
      flag = true;
      break;
    }
  }
  if (!flag) {
    return <Redirect to="/login" />;
  } else {
    return <div>{props.children}</div>;
  }
}