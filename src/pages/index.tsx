import styles from './index.less';
import { connect, IRouteComponentProps } from 'umi';
import { UserModelState } from '@/models/user';
import React from 'react';
interface UserStateProps {
  user: UserModelState;
}
// type IndexReduxType = ReturnType<typeof mapStateToProps>
const IndexPage = ({
  user,
  location,
}: UserStateProps & IRouteComponentProps) => {
  return (
    <div className={styles.index}>
      <h1>您好，尊敬的{user.name}老师</h1>
      <h1>欢迎进入广州大学实验报告上传系统 </h1>
    </div>
  );
};
function mapStateToProps({ user }: { user: UserModelState }) {
  return {
    user,
  };
}
// IndexPage.wrappers = ['@/wrappers/haveLogin'];
var newIndex = connect(mapStateToProps)(IndexPage);

export default newIndex;
