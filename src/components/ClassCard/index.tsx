import React from 'react';
import { Link, withRouter, IRouteComponentProps } from 'umi';
import { FolderOutlined } from '@ant-design/icons';
import styles from './index.less';
function ClassCard({ name, uid, location }: IRouteComponentProps) {
  return (
    <Link
      className={styles['classCard-wrapper']}
      to={{
        pathname: '/selectexperiment',
        state: {
          ...location.state,
          classUid: uid,
          className: name,
        },
      }}
    >
      <FolderOutlined style={{ fontSize: '36px' }} />
      <span>{name}</span>
    </Link>
  );
}

export default withRouter(ClassCard);
