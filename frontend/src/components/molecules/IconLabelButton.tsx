import styled from 'styled-components';
import { Colors } from '../../constants/color';
import { Button, ButtonProp, Icon } from '../atoms';

const ButtonContainer = styled(Button)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  width: 234px;
  height: 50px;
`;

const IconContainer = styled.span<{background: string}>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 12px;
  background-color: ${p => p.background};
`;

const LabelContainer = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 60px;
  font-size: 18px;
  font-family: BMJua;
`;

interface Prop extends ButtonProp {
  name: string;
  label: string;
  background?: string;
  iconBackground?: string;
}

const IconLabelButton = ({
  name,
  label,
  iconBackground,
  onClick,
  ...props
}: Prop) => {
  return (
    <ButtonContainer {...props} onClick={onClick}>
      <IconContainer 
        background={iconBackground ?? Colors.primary}
        onClick={onClick}
      >
        <Icon name={name} />
      </IconContainer>
      <LabelContainer>
        {label}
      </LabelContainer>
    </ButtonContainer>
  );
};

export default IconLabelButton;