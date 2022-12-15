 import React from "react";
import styled from "styled-components";
import { tryCall } from "../../util";
import { Slider } from "../atoms";
import { InputGroup, InputGroupProp } from "../molecules";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface Prop extends InputGroupProp {
  label: string;
  min: number;
  max: number;
  step: number;
  text?: string;
  value?: number;
  sliderWidth: number;
}

const InputSlider = ({
  label,
  text,
  value,
  sliderWidth,
  onChange: _onChange,
  onMouseWheel,
  ...props
}: Prop) => {
  const onChange = (evt: any) => {
    tryCall(_onChange, evt);
  };
  return (
    <Container>
      <InputGroup label={label} value={text} onMouseWheel={onMouseWheel}/>
      <Slider {...props} width={sliderWidth} value={value ?? 0} onChange={onChange} onMouseWheel={onMouseWheel} />
    </Container>
  );
}

export default React.memo(InputSlider) as typeof InputSlider;