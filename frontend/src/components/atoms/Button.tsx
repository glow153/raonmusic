import styled from 'styled-components';
import { Colors } from '../../constants/color';
import { tryCall } from '../../util';

const defaultColor = Colors.defaultBackgroundButton;
const defaultHoverColor = Colors.defaultBackgroundButtonHover;
const ButtonContainer = styled.button<Prop>`
  font-family: NanumGothic;
  border-radius: 12px;
  border-width: 0px;
  ${p => p.disabled ? 'opacity: 0.5;' : 'cursor: pointer;'}
  background-color: ${(p) => (
    p.primary ? Colors.primary
      : p.secondary ? Colors.secondary
      : p.gray ? Colors.gray
      : defaultColor
  )};
  ${p => p.disabled ? '' : `
    &:hover {
      background-color: ${(
        p.primary ? Colors.primaryHover
          : p.secondary ? Colors.secondaryHover
          : p.gray ? Colors.grayHover
          : defaultHoverColor
      )};
    }
  `}
`;

interface Prop {
  style?: any;
  children?: any;
  primary?: boolean;
  secondary?: boolean;
  gray?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>
} 

const Button = ({
  children,
  onClick: _onClick,
  ...props
}: Prop) => {
  const onClick = () => {
    if(!props.disabled) tryCall(_onClick);
  }
  return (
    <ButtonContainer {...props} onClick={onClick}>
      {children}
    </ButtonContainer>
  );
};

export default Button;
export type { Prop };
