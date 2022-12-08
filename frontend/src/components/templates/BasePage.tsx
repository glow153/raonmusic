import React from 'react';

import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  background-color: #fdfaf5;
  padding-left: 15%;
  padding-right: 15%;
  height: 100%;
  justify-content: center;
`;

interface Prop {
  style?: any;
  children?: any;
}

const BasePage = ({
  style,
  children
}: Prop) => {
  return (
    <Container style={style}>
      {children}
    </Container>
  );
};

export default BasePage;