import styled from 'styled-components';
import { Colors } from '../../constants/color';

const defaultColor = Colors.defaultBackgroundButton;
const defaultHoverColor = Colors.defaultBackgroundButtonHover;
const ButtonContainer = styled.button<Prop>`
  font-family: NanumGothic;
  border-radius: 12px;
  border-width: 0px;
  cursor: pointer;
  background-color: ${(p) => (
    p.primary ? Colors.primary
      : p.secondary ? Colors.secondary
      : p.gray ? Colors.gray
      : defaultColor
  )};
  &:hover {
    background-color: ${(p) => (
      p.primary ? Colors.primaryHover
        : p.secondary ? Colors.secondaryHover
        : p.gray ? Colors.grayHover
        : defaultHoverColor
    )};
  }
`;

interface Prop {
  style?: any;
  children?: any;
  primary?: boolean;
  secondary?: boolean;
  gray?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>
} 

const Button = ({
  children,
  ...props
}: Prop) => {
  return (
    <ButtonContainer {...props}>
      {children}
    </ButtonContainer>
  );
};

export default Button;
export type { Prop };
