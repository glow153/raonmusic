import React from "react";
import styled from "styled-components";
import { Link } from '.';
import { Colors } from '../../constants/color';
import { MAX_VIEWPORT_WIDTH_FOR_MOBILE } from "../../constants/data";

const DEFAULT_LOGO_SIZE = 45;

const LogoWrapper = styled.div`
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
  @media screen and (max-width: ${MAX_VIEWPORT_WIDTH_FOR_MOBILE}px) {
    display: none;
  }
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
    <Link to='/' style={{color: Colors.textDefault}}>
      <LogoWrapper>
        <LogoImg width={size} height={size} src='/img/raonmusic_logo.svg' />
        <LogoText>{text}</LogoText>
      </LogoWrapper>
    </Link>
  );
};

export default React.memo(Logo);