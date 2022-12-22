import styled from 'styled-components';
import { Input, InputProp } from '../atoms';

interface ContainerProp {
  width?: number;
  height?: number;
  marginTop?: number;
  flex?: number;
}

const InputGroupContainer = styled.div<ContainerProp>`
  ${p => p.width ? `width: ${p.width}px;` : ''}
  ${p => p.height ? `height: ${p.height}px;` : ''}
  ${p => p.marginTop ? `margin-top: ${p.marginTop}px;` : ''}
  display: flex;
  align-items: center;
  position: relative;
  ${p => p.flex ? `flex: ${p.flex};` : ''}
`;

const StyledLabel = styled.label`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  margin-right: 5px;
  flex: 1 1 40px;
`;

const StyledInput = styled(Input)<{disabled: boolean}>`
  padding: 5px;
  font-size: 14px;
  border-radius: 8px;
  color: #fdfaf5;
  background-color: ${p => p.disabled ? '#777' : '#0e3049'};
  text-align: center;
  flex: 1 1 40px;
`;

export interface Prop extends InputProp, ContainerProp {
  id?: string,
  label: string,
  buttonLabel?: string;
  disabled?: boolean;
} 

const InputGroup = ({
  id,
  label,
  width,
  height,
  marginTop,
  flex,
  disabled,
  buttonLabel,
  ...props
}: Prop) => {
  return (
    <InputGroupContainer width={width} height={height} marginTop={marginTop} flex={flex}>
      <StyledLabel htmlFor={id}>{label}</StyledLabel>
      <StyledInput id={id} {...props}
        disabled={disabled ?? false}
        readonly
      />
    </InputGroupContainer>
  );
};

export default InputGroup;