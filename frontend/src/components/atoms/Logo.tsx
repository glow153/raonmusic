import React from 'react';
import styled from "styled-components";

const DEFAULT_LOGO_SIZE = 45;

const LogoWrapper = styled.a`
  display: flex;
  flex-direction: row;
  text-decoration: none;
  cursor: pointer;
`;
const LogoImg = styled.img`
  width: ${({width}) => width}px;
  height: ${({width}) => width}px;
`;
const LogoText = styled.div`
  font-family: 'godoRounded R';
  font-size: 34px;
  font-weight: 400;
  margin-left: 27px;
`;

interface Prop {
  size?: number;
  text?: string;
}

const Logo = ({
  size = DEFAULT_LOGO_SIZE,
  text,
}: Prop) => {
  return (
    <LogoWrapper href='/'>
      <LogoImg width={size} height={size} src='img/raonmusic_logo.svg' />
      <LogoText>{text}</LogoText>
    </LogoWrapper>
  );
};

export default Logo;