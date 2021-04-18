import React, { useEffect, useState } from 'react';
import { connect, IRouteComponentProps, Redirect } from 'umi';
import { getClassByCourseId } from '@/services/class';
import ClassCard from '@/components/ClassCard';
import { message } from 'antd';
import { classData } from '@/type/index';
import styles from './index.less';
function SelectCourse({ location }: IRouteComponentProps) {
  var courseId = location.state.courseId;
  // 通过仓库拿到数据
  const [classes, setClasses] = useState([]);
  const [grades, setGrades] = useState([]);
  // 请求班级
  useEffect(() => {
    getClassByCourseId(courseId)
      .then((data) => {
        console.log(data);
        setClasses(data.classes);
        setGrades(data.grades);
      })
      .catch((err) => {
        message.error(err.message || '请求班级错误');
      });
  }, [courseId]);
  return (
    (grades &&
      grades.map((grade: string) => {
        return (
          <div key={grade}>
            <h1>{grade}级</h1>
            <div className={styles['selectClass-wrapper']}>
              {classes.map((item: classData) => {
                if (item.grade == grade) {
                  return (
                    <ClassCard
                      key={item.id}
                      name={item.name}
                      id={item.id}
                    ></ClassCard>
                  );
                }
              })}
            </div>
          </div>
        );
      })) || <div></div>
  );
}
export default SelectCourse;
