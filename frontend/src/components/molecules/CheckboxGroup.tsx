import styled from 'styled-components';
import { Checkbox, Input, InputProp } from '../atoms';

interface ContainerProp {
  width?: number;
  height?: number;
  marginTop?: number;
}

const InputGroupContainer = styled.div<ContainerProp>`
  width: ${p => p.width}px;
  height: ${p => p.height}px;
  margin-top: ${p => p.marginTop}px;
  display: flex;
  align-items: center;
  position: relative;
`;

const StyledLabel = styled.label`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  font-size: 13px;
  margin-right: 5px;
`;

const StyledInput = styled(Input)`
  width: 50px;
  padding: 5px;
  font-size: 14px;
  border-radius: 8px;
  color: #fdfaf5;
  background-color: #0e3049;
  text-align: center;
`;

export interface Prop extends InputProp {
  id?: string,
  label: string,
  width?: number;
  height?: number;
  marginTop?: number;
  buttonLabel?: string;
  isChecked: boolean;
} 

const CheckboxGroup = ({
  id,
  label,
  width,
  height,
  marginTop,
  buttonLabel,
  ...props
}: Prop) => {
  return (
    <InputGroupContainer width={width} height={height} marginTop={marginTop}>
      <StyledLabel htmlFor={id}>{label}</StyledLabel>
      <Checkbox {...props} />
    </InputGroupContainer>
  );
};

export default CheckboxGroup;