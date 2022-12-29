import styled from 'styled-components';
import { Colors } from '../../constants/color';
import { Button, ButtonProp, Icon } from '../atoms';

const ButtonContainer = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

interface Prop extends ButtonProp {
  name: string;
  color?: string;
  iconStyle?: any;
}

const IconButton = ({
  children,
  name,
  color = Colors.textDefault,
  iconStyle,
  ...props
}: Prop) => {
  return (
    <ButtonContainer {...props}>
      <Icon name={name} style={iconStyle} fill={color} />
    </ButtonContainer>
  );
};

export default IconButton;