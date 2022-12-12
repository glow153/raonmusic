import styled from 'styled-components';
import { Input } from '../atoms';

interface ContainerProp {
  width?: number;
  height?: number;
  marginTop?: number;
}

const InputGroupContainer = styled.div<ContainerProp>`
  width: ${p => p.width}px;
  height: ${p => p.height}px;
  margin-top: ${({marginTop}) => marginTop}px;
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

interface Prop {
  id?: string,
  label: string,
  value?: string | number;
  width?: number;
  height?: number;
  padding?: number;
  marginTop?: number;
  placeholder?: string;
  buttonLabel?: string;
} 

const InputGroup = ({
  id,
  label,
  width,
  height,
  padding,
  marginTop,
  placeholder,
  buttonLabel,
  value,
  ...props
}: Prop) => {
  return (
    <InputGroupContainer width={width} height={height} marginTop={marginTop}>
      <StyledLabel htmlFor={id}>{label}</StyledLabel>
      <StyledInput id={id} padding={padding} placeholder={placeholder} value={value} readonly />
    </InputGroupContainer>
  );
};

export default InputGroup;