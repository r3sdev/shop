import styled from 'styled-components';

export const CardRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
  margin-top: ${(props: { marginTop?: number | string }) => props.marginTop ? props.marginTop : 0};
`