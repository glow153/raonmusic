import React from 'react';
import styled from 'styled-components';
import { Button } from '../atoms';

const StyledButton = styled(Button)`
  width: 130px;
  height: 45px;
  border-radius: 12px;
  border-width: 0px;
`;

interface Prop {
  style?: any;
  children?: any;
  primary?: boolean;
  secondary?: boolean;
} 

const NavButton = ({
  children,
  ...props
}: Prop) => {
  return (
    <StyledButton {...props}>
      {children}
    </StyledButton>
  );
};

export default NavButton;