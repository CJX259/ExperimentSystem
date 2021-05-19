import React from 'react';
import { Link, withRouter, IRouteComponentProps } from 'umi';
import { FolderOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import styles from './index.less';
function ClassCard({ name, uid, location }: IRouteComponentProps) {
  return (
    <div className={styles['classCard-wrapper']}>
      <FolderOutlined style={{ fontSize: '40px' }} />
      <span style={{ textAlign: 'center' }}>{name}</span>
      <Space className={styles['link-wrapper']}>
        <Link
          to={{
            pathname: '/selectexperiment',
            state: {
              ...location.state,
              classUid: uid,
              className: name,
            },
          }}
        >
          <Button size="small">查看</Button>
        </Link>
        <Link
          to={{
            pathname: '/rating',
            state: {
              ...location.state,
              classUid: uid,
              className: name,
            },
          }}
        >
          <Button size="small">评分</Button>
        </Link>
      </Space>
    </div>
  );
}

export default withRouter(ClassCard);
