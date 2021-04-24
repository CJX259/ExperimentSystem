import React, { useEffect, useState } from 'react';
import { IRouteComponentProps } from 'umi';
import { getClassByCourseId } from '@/services/class';
import ClassCard from '@/components/ClassCard';
import { message, Spin } from 'antd';
import { classData } from '@/type/index';
import styles from './index.less';
function SelectCourse({ location }: IRouteComponentProps) {
  var courseId = location.state.courseId;
  // 通过仓库拿到数据
  const [classes, setClasses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [classLoading, setClassLoading] = useState(false);
  // 请求班级
  useEffect(() => {
    setClassLoading(true);
    getClassByCourseId(courseId)
      .then((data) => {
        setClasses(data.classes);
        setGrades(data.grades);
      })
      .catch((err) => {
        message.error(err.message || '请求班级错误');
      })
      .finally(() => {
        setClassLoading(false);
      });
  }, [courseId]);
  return (
    <Spin spinning={classLoading}>
      {(grades &&
        grades.map((grade: string) => {
          return (
            <div key={grade}>
              <h1>{grade}级</h1>
              <div className={styles['selectClass-wrapper']}>
                {classes.map((item: classData) => {
                  if (item.grade == grade) {
                    return (
                      <ClassCard
                        key={item.uid}
                        name={item.name}
                        uid={item.uid}
                      ></ClassCard>
                    );
                  }
                })}
              </div>
            </div>
          );
        })) || <div>没有班级</div>}
    </Spin>
  );
}
export default SelectCourse;
