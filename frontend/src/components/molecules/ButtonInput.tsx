import React from 'react';
import styled from 'styled-components';
import { Button, Input } from '../atoms';

interface ContainerProp {
  width?: number;
  height?: number;
  marginTop?: number;
}

const ButtonInputContainer = styled.div<ContainerProp>`
  width: ${p => p.width}px;
  height: ${p => p.height}px;
  margin-top: ${({marginTop}) => marginTop}px;
  display: flex;
  align-items: center;
  position: relative;
`;

interface Prop {
  width?: number;
  height?: number;
  padding?: number;
  marginTop?: number;
  placeholder?: string;
  buttonLabel?: string;
  value?: string | number;
} 

const ButtonInput = ({
  width,
  height,
  padding,
  marginTop,
  placeholder,
  buttonLabel,
  ...props
}: Prop) => {
  return (
    <ButtonInputContainer width={width} height={height} marginTop={marginTop}>
      <Input padding={padding} placeholder={placeholder} />
      <Button primary style={{position: 'absolute', right: padding}}>{buttonLabel}</Button>
    </ButtonInputContainer>
  );
};

export default ButtonInput;