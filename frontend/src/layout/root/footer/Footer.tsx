import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  position: relative;
  display: block;
  width: 100%;
  height: 85px;
`;

interface Prop {
  children?: any;
}

const Footer = ({
  children
}: Prop) => {
  return (
    <FooterContainer>
      {children}
    </FooterContainer>
  );
};

export default Footer;