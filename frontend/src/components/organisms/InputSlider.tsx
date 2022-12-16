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
  disabled?: boolean;
}

const InputSlider = ({
  label,
  text,
  value,
  sliderWidth,
  onChange: _onChange,
  onMouseWheel: _onMouseWheel,
  disabled = false,
  ...props
}: Prop) => {
  const onChange = (evt: any) => {
    tryCall(_onChange, evt);
  };
  const onMouseWheel = (evt: React.WheelEvent<HTMLInputElement>) => {
    !disabled && tryCall(_onMouseWheel, evt);
  };
  return (
    <Container>
      <InputGroup label={label} value={text} onMouseWheel={onMouseWheel} disabled={disabled} />
      <Slider {...props} width={sliderWidth} value={value ?? 0} onChange={onChange} onMouseWheel={onMouseWheel} disabled={disabled} />
    </Container>
  );
}

export default InputSlider;