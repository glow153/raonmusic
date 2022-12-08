import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  top: 0;
  left: 0;
  height: 56px;
  width: 100%;
  background-color: skyblue;
`;

interface Prop {
  className?: string;
}

const Header = ({
  className
}: Prop) => {
  return (
    <Container className={className}>
      Header
    </Container>
  );
};

export default Header;