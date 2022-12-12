import styled from 'styled-components';

interface ContainerProp {
  width: number;
}
interface RangeProp {
  min: number;
  max: number;
  value: number;
}

const SliderContainer = styled.div<ContainerProp>`
  margin-left: 15px;
  width: ${p => p.width + 15}px;
`;

const InputRange = styled.input`
  width: 100%;
  height: 100%;
  -webkit-appearance: none;
  background: transparent;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 35px;
    height: 35px;
    background-color: #fdfaf5;
    border: 14px solid #0e3049;
    border-radius: 50%;
    margin-top: -5.5px;
  }
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 25px;
    border-radius: 13px;
    background-color: #fbebcc;
  }
`;

interface Prop extends ContainerProp, RangeProp {
  step: number;
  thumbSize?: number;
}

const Slider = ({
  width = 300,
  value,
  thumbSize,
  ...props
}: Prop) => {
  return (
    <SliderContainer width={width}>
      <InputRange {...props} type='range' />
    </SliderContainer>
  );
};


export default Slider;