import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Colors } from '../../constants/color';
import { isNumber, tryCall } from '../../util';

interface ElementProp {
  width?: number;
  height?: number;
  padding?: number;
  marginTop?: number;
} 

const InputElement = styled.input<ElementProp>`
  background-color: ${Colors.inputBackground};
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

export interface Prop extends ElementProp {
  id?: string;
  style?: any;
  placeholder?: string;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onMouseWheel?: React.WheelEventHandler<HTMLInputElement>;
  readonly?: boolean;
} 

const Input = ({
  placeholder,
  onChange: _onChange,
  onMouseWheel: _onMouseWheel,
  ...props
}: Prop) => {
  const onChange = useCallback((evt: any) => {
    tryCall(_onChange, evt);
  }, [_onChange]);
  const onMouseWheel = useCallback((evt: any) => {
    tryCall(_onMouseWheel, evt);
  }, [_onMouseWheel]);
  
  return (
    <InputElement type='text' placeholder={placeholder} {...props}
      onChange={onChange}
      onWheel={onMouseWheel}
      onWheelCapture={onMouseWheel}
    />
  );
};

export default Input;