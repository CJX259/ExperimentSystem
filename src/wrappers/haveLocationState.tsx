import React from 'react'
import { Redirect } from 'umi';
export default function haveLocationState(props: any) {
  if(!props.location.state){
    return <Redirect to="/" />;
  }else{
    return <div>{props.children}</div>
  }
}
