import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)`
  text-decoration: none;
`;

interface Prop {
  to: string;
  style?: any;
  children?: any;
}


const CustomLinkComponent = ({
  children,
  ...props
}: Prop) => {
  return (
    <StyledLink {...props}>{children}</StyledLink>
  );
};

export default CustomLinkComponent;