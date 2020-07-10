
import styled from 'styled-components';

export const ProductRow = styled.div`
  position: relative;
  top: -5rem;
  width: 100%;
  height: 300px;
  z-index: 1;
  margin: 0 -15px;
  overflow-x: auto;
  margin-top: -3rem;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const ProductDiv = styled.div`
  height: 255px;
  background: white;
  display: flex;
  flex-direction: center;
  align-items: center;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;

  &:hover {
    ox-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  }
`

export const ProductImage = styled.img`
    src: url(${props => props.src});
    width: 150px;
    height: 150px;
    position: relative;
    top: 1rem;
    left: 2rem;
`;

export const ProductArticle = styled.article`
`

export const ProductFigure = styled.figure`
`

export const PriceRow = styled.div`
  background: white;
  display: flex;
  align-items: flex-start;
  position: absolute;
  right: 4rem;
  bottom: 4rem;
  padding: .5rem;
`
export const PriceEuro = styled.span`
  font-size: 2rem;
  font-weight: bold;
`
export const PriceSeperator = styled.span`
  font-size: 1rem;
  position: relative;
  top: 1.4rem;
`

export const PriceCents = styled.span`
  margin-top: 7px;
  margin-left: -4px;
`

export const CircleButton = styled.button`
  color: white;
  position: absolute;
  right: 2rem;
  bottom: 1rem;
`

export const ProductTitle = styled.span`
  font-family: HamburgTS,Arial,Helvetica,sans-serif;
  color: #303030;
  position: relative;
  left: 1rem;
  top: 1rem;
`

