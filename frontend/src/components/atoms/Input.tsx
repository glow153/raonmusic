import React from 'react';
import styled from 'styled-components';
import { Colors } from '../../constants/color';
import { isNumber } from '../../util';

interface ElementProp {
  width?: number;
  height?: number;
  padding?: number;
  marginTop?: number;
} 

const InputElement = styled.input<ElementProp>`
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
  style?: any;
  width?: number;
  height?: number;
  padding?: number;
  marginTop?: number;
  placeholder?: string;
  value?: string | number;
  onChange?: () => void;
  readonly?: boolean;
} 

const Input = ({
  placeholder,
  ...props
}: Prop) => {
  return (
    <InputElement type='text' placeholder={placeholder} {...props} />
  );
};

export default Input;