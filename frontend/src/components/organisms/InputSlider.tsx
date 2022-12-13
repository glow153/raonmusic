 import React, { ChangeEventHandler } from "react";
import styled from "styled-components";
import { Slider } from "../atoms";
import { InputGroup } from "../molecules";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface Prop {
  label: string;
  min: number;
  max: number;
  step: number;
  text?: string;
  value?: number;
  sliderWidth: number;
  onChange: ChangeEventHandler<HTMLInputElement>
}

const InputSlider = ({
  label,
  text,
  value,
  sliderWidth,
  ...props
}: Prop) => {
  return (
    <Container>
      <InputGroup label={label} value={text} />
      <Slider width={sliderWidth} value={value ?? 0} {...props} />
    </Container>
  );
}

export default React.memo(InputSlider) as typeof InputSlider;