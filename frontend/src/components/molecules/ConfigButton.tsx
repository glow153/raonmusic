import { useState } from "react";
import styled from "styled-components";
import { Button, ButtonProp } from "../atoms";

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 6px 11px;
  min-width: 53px;
  span{font-family:BMJua;line-height:1.3;}
  .title{font-size:18px;}
  .subtitle{font-size:12px;}
`;

interface Props extends ButtonProp {
}

const ConfigButton = ({
  children,
  ...props
}: Props) => {
  const [isOptionShown, showOption] = useState<boolean>(false);
  
  return (
    <>
      {/* {isOptionShown ? (
        <>

        </>
      ) : null} */}
      <StyledButton {...props}>
        {children}
      </StyledButton>
    </>
  );
};

export default ConfigButton;