import styled from "styled-components";

interface ContainerProp {
  size?: number;
  weight?: number;
}

const SpinnerContainer = styled.div<ContainerProp>`
  border: ${p => p.weight}px solid #f3f3f3;
  border-top: ${p => p.weight}px solid #3498db;
  border-radius: 50%;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

interface Prop extends ContainerProp {

}

const Spinner = ({
  size = 19,
  weight = 5,
}: Prop) => {
  return (
    <SpinnerContainer size={size} weight={weight} />
  );
};

export default Spinner;