import styled from 'styled-components';
import { Colors } from '../../constants/color';

interface SliderContainerProp {
  width?: number;
  flex?: number;
}
const SliderContainer = styled.div<SliderContainerProp>`
  margin-left: 15px;
  ${p => p.width ? `width: ${p.width}px;` : ''}
  ${p => p.flex ? `flex: ${p.flex};` : ''}
`;

interface RangeProp {
  min: number;
  max: number;
  value: number;
  disabled?: boolean;
}
const InputRange = styled.input<RangeProp>`
  width: 100%;
  -webkit-appearance: none;
  background: transparent;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 35px;
    height: 35px;
    background-color: #fdfaf5;
    border: 14px solid ${p => p.disabled ? '#aaa' : '#0e3049'};
    border-radius: 50%;
    margin-top: -5.5px;
  }
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 25px;
    border-radius: 13px;
    background-color: ${p => p.disabled ? Colors.brighter : Colors.secondary};
  }
`;

export interface Prop extends SliderContainerProp, RangeProp {
  step: number;
  thumbSize?: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onMouseWheel?: React.WheelEventHandler<HTMLInputElement>;
}

const Slider = ({
  width,
  flex,
  value,
  thumbSize,
  onChange,
  onMouseWheel,
  disabled,
  ...props
}: Prop) => {

  return (
    <SliderContainer width={width} flex={flex}>
      <InputRange {...props}
        type='range'
        value={value}
        disabled={disabled}
        onChange={onChange}
        onWheel={onMouseWheel}
      />
    </SliderContainer>
  );
};


export default Slider;