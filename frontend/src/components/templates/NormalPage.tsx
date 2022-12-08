import React from 'react';
import styled from 'styled-components';
import { Header } from '../../layout/root/header';
import Root from '../../layout/root/Root';

const Main = styled.main`
`;

interface Prop {
  style?: any;
  children?: any;
}

const NormalPage = ({
  style,
  children
}: Prop) => {
  return (
    <Root style={style}>
      <Header />
      <Main>
        {children}
      </Main>
    </Root>
  );
};

export default NormalPage;