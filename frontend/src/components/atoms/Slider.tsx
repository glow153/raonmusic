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
  width: ${p => p.width}px;
  -webkit-appearance: none;
  background: transparent;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 35px;
    height: 35px;
    background-color: #fdfaf5;
    border: 14px solid #0e3049;
    border-radius: 50%;
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
      <InputRange type='range' {...props} />
    </SliderContainer>
  );
};


export default Slider;