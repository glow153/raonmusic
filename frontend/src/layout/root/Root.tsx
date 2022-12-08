import React from 'react';

import styled from 'styled-components';

const RootContainer = styled.div`
  height: 100%;
`;

interface Prop {
  style?: any;
  children?: any;
}

const Root = ({
  style,
  children
}: Prop) => {
  return (
    <RootContainer style={style}>
      {children}
    </RootContainer>
  );
};

export default Root;