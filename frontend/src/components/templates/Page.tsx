import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  
`;

interface Prop {
  style?: any;
  children?: any;
}

const Page = ({
  style,
  children,
}: Prop) => {
  return (
    <Section style={style}>
      {children}
    </Section>
  );
};

export default Page;