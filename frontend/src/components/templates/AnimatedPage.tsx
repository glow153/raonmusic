import { motion } from "framer-motion";
import styled from 'styled-components';

const Section = styled(motion.section)`
`;

interface Prop {
  style?: any;
  children?: any;
  animationConfig?: {
    initial: any;
    animate: any;
    exit: any;
    transition: any;
  };
}

const Page = ({
  style,
  children,
  animationConfig: _animationConfig,
}: Prop) => {
  const animationConfig = Object.assign({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  }, _animationConfig);

  return (
    <Section
      style={style}
      initial={animationConfig?.initial}
      animate={animationConfig?.animate}
      exit={animationConfig?.exit}
      transition={animationConfig?.transition}
    >
      {children}
    </Section>
  );
};

export default Page;