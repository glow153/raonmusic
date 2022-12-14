import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Logo } from '../../../components/atoms';
import { NavButton } from '../../../components/molecules';

const HeaderContainer = styled.header`
  position: relative;
  display: flex;
  background-color: #fdfaf5;
  top: 0;
  left: 0;
  height: 85px;
  align-items: center;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
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
        <Link to='/'><NavButton>사용 방법</NavButton></Link>
        <Link to='/about'><NavButton>회사 소개</NavButton></Link>
        <Link to='/login'><NavButton secondary>로그인</NavButton></Link>
      </Nav>
    </HeaderContainer>
  );
};

export default React.memo(Header);