import React from 'react';
import styled from 'styled-components';
import { Button, Logo } from '../../../components/atoms';

const HeaderContainer = styled.header`
  position: relative;
  display: flex;
  background-color: #fdfaf5;
  top: 0;
  left: 0;
  height: 85px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
`;


const Header = () => {
  return (
    <HeaderContainer>
      <Logo text='raon music' />
      <Nav>
        <Button secondary>사용 방법</Button>
        <Button secondary>회사 소개</Button>
        <Button primary>로그인</Button>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;