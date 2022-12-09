import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Page } from '../components/templates';

const Topbar = styled.section`
  width: '100%';
`;

const Example = () => {
  return (
    <Page>
      <div style={{display: 'flex'}}>
        <Link to='/' style={{textDecoration: 'none'}}>
          {/* <IcHome /> */}
          HOME
        </Link>
      </div>
      <h1>소개</h1>
      <p>이 프로젝트는 리액트 라우터 기초를 실습해 보는 예제 프로젝트입니다.</p>
    </Page>
  );
};

export default Example;