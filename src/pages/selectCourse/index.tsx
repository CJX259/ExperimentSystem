import React, { useEffect, useState } from 'react'
import { connect, IRouteComponentProps, Redirect } from 'umi';
import { UserModelState } from '@/models/user';
import { getClassByCourseId } from '@/services/class';
import ClassCard from '@/components/ClassCard';
import { classData } from '@/type/index';
import styles from './index.less';
function SelectCourse({ location, user }: IRouteComponentProps) {
  var courseId = location.state.courseId;
  // 通过仓库拿到数据
  const [classes, setClasses] = useState([]);
  // 请求班级
  useEffect(() => {
    getClassByCourseId(courseId, user.tid).then(data => {
      setClasses(data);
    });
  }, [courseId])
  return (
    <div className={styles['selectClass-wrapper']}>
      {
        classes.map((item: classData) => {
          return <ClassCard key={item.id} name={item.name} id={item.id}></ClassCard>
        })
      }
    </div>
  )
}
function mapStateToProps({ user }: { user: UserModelState }){
  return {
    user
  }
}
export default connect(mapStateToProps)(SelectCourse);
