import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  position: relative;
  display: flex;
  background-color: #fdfaf5;
  top: 0;
  left: 0;
  height: 85px;
  width: 100%;
  align-items: center;
  justify-contents: space-between;
`;


interface Prop {
}

const Footer = ({
}: Prop) => {
  return (
    <FooterContainer>
      
    </FooterContainer>
  );
};

export default Footer;