import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)<{color?: string}>`
  text-decoration: none;
  color: ${p => p.color};
`;

interface Prop {
  to: string;
  color?: string;
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