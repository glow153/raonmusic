import styled from 'styled-components';
import { Button, ButtonProp, Icon } from '../atoms';

const ButtonContainer = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
`;

interface Prop extends ButtonProp {
  name: string;
}

const GroupedButton = ({
  children,
  name,
  ...props
}: Prop) => {
  return (
    <ButtonContainer {...props}>
      <Icon name={name} />
    </ButtonContainer>
  );
};

export default GroupedButton;