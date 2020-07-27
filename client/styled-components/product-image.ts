import styled from 'styled-components';

export const ProductImage = styled.img`
  src: url(${(props) => props.src});
  width: 150px;
  height: 150px;
  position: relative;
  top: 1rem;
  left: 2rem;
`;
