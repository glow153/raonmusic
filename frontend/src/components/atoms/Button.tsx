import React from 'react';
import styled from 'styled-components';
import { Colors } from '../../constants/color';

const ButtonContainer = styled.button<Prop>`
  background-color: ${(p) => p.primary ? Colors.primary : Colors.secondary};
  height: 100%;
  font-family: NanumGothic;
  width: 130px;
  height: 45px;
  border-radius: 12px;
  border-width: 0px;
  cursor: pointer;
  &:hover {
    background-color: ${(p) => p.primary ? Colors.primaryHover : Colors.secondaryHover};
  }
`;

interface Prop {
  style?: any;
  children?: any;
  primary?: boolean;
  secondary?: boolean;
} 

const Button = ({
  children,
  ...props
}: Prop) => {
  return (
    <ButtonContainer {...props}>
      {children}
    </ButtonContainer>
  );
};

export default Button;