import React from 'react';
import styled from 'styled-components';
import { Colors } from '../../constants/color';
import { isNumber } from '../../util';

const InputContainer = styled.input<Prop>`
  background-color: ${Colors.inputBackground};
  font-family: NanumGothic;
  width: ${p => isNumber(p.width) ? p.width : '100%'};
  height: ${p => p.height ?? 120}px;
  border-radius: 12px;
  border-width: 0px;
  cursor: pointer;
`;

interface Prop {
  width?: number;
  height?: number;
  hint?: string;
  value?: string | number;
} 

const Input = ({
  ...props
}: Prop) => {
  return (
    <InputContainer {...props} type='text' />
  );
};

export default Input;