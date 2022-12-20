import styled from 'styled-components';
import { Colors } from '../../constants/color';
import { tryCall } from '../../util';
import { Button, ButtonProp, Icon, Spinner } from '../atoms';

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
  loading?: boolean;
}

const IconLabelButton = ({
  name,
  label,
  iconBackground,
  onClick: _onClick,
  loading,
  ...props
}: Prop) => {
  const onClick = () => {
    !loading && tryCall(_onClick);
  }
  return (
    <ButtonContainer {...props} onClick={onClick} disabled={loading}>
      <IconContainer
        background={iconBackground ?? Colors.primary}
        onClick={onClick}
      >
        {loading ? <Spinner /> : <Icon name={name} />}
      </IconContainer>
      <LabelContainer>
        {label}
      </LabelContainer>
    </ButtonContainer>
  );
};

export default IconLabelButton;