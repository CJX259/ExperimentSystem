export function getCookie(name: string, cookie?: string) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  var myCookie = cookie?cookie : document.cookie; 
  if (arr = myCookie.match(reg)) {
    return unescape(arr[2]);
  } else {
    return null;
  }
}
export function delCookie(name: string) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  // 这里需要判断一下cookie是否存在
  var c = getCookie(name);
  if (c != null) {
    document.cookie = name + "=" + c + ";expires=" + exp.toUTCString();
  }
}