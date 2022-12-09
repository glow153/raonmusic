import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  height: 100%;
`;

interface Prop { 
  children?: any;
}

const Page = ({
  children
}: Prop) => {
  return (
    <Section>
      {children}
      </Section>
  );
};

export default Page;