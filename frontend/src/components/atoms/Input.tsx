import React from 'react';
import styled from 'styled-components';
import { Colors } from '../../constants/color';
import { isNumber } from '../../util';

interface ContainerProp {
  width?: number;
  height?: number;
  padding?: number;
  marginTop?: number;
  value?: string | number;
} 

const InputContainer = styled.input<ContainerProp>`
  background-color: ${Colors.inputBackground};
  font-family: NanumGothic;
  width: ${p => isNumber(p.width) ? p.width + 'px' : '100%'};
  height: ${p => p.height}px;
  padding: ${p => p.padding ?? 12}px;
  margin-top: ${p => p.marginTop}px;
  border-radius: 12px;
  border-width: 0px;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  &:focus {
    border-color: #86b7fe;
    outline: 0;
    box-shadow: 0 0 0 0.25rem #0d6efd40;
  }
`;

interface Prop {
  width?: number;
  height?: number;
  padding?: number;
  marginTop?: number;
  placeholder?: string;
  value?: string | number;
} 

const Input = ({
  placeholder,
  ...props
}: Prop) => {
  return (
    <InputContainer type='text' placeholder={placeholder} {...props} />
  );
};

export default Input;