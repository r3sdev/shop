import { ProductRow, ProductDiv, ProductArticle, ProductFigure, ProductImage, PriceRow, PriceEuro, PriceSeperator, PriceCents, CircleButton, ProductTitle } from "./styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default ({ products, currentUser }) => {

    const hasProducts = products.length > 0;

    const onAddProduct = (productId: string) => {
        console.log('Adding product', productId, currentUser.id)
    }

    if (!hasProducts) return null;

    return (
        <ProductRow>
            {
                products.map(product => {
                    const price = product.price.toFixed(2).split(".");

                    const [euro, cents] = price;

                    return (
                        <div className="col-12 col-md-3" key={product.id}>
                            <ProductDiv>
                                <ProductArticle>
                                    <ProductFigure>
                                        <ProductImage
                                            className="img-fluid"
                                            src={product.imageUrl}
                                            alt={product.title}
                                        />
                                    </ProductFigure>
                                    <PriceRow>
                                        <PriceEuro>{euro}</PriceEuro>
                                        <PriceSeperator>▪</PriceSeperator>
                                        <PriceCents>{cents}</PriceCents>
                                    </PriceRow>
                                    <CircleButton
                                        className="btn btn-warning btn-circle"
                                        onClick={() => onAddProduct(product.id)}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </CircleButton>
                                    <ProductTitle>
                                        {product.title}
                                    </ProductTitle>
                                </ProductArticle>
                            </ProductDiv>
                        </div>
                    )
                })
            }
        </ProductRow>
    )
}