import { ProductRow, ProductDiv, ProductArticle, ProductFigure, ProductImage, PriceRow, PriceEuro, PriceSeperator, PriceCents, CircleButton, ProductTitle } from "../styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import useRequest from '../hooks/use-request';

import type { FeaturedProductsProps, FeaturedProductAttrs } from "../types";
import { useRouter } from "next/router";

export const FeaturedProducts = ({ products, cart }: FeaturedProductsProps) => {

    /* Hooks */
    const router = useRouter();

    const { doRequest, errors } = useRequest({
        url: '/api/cart',
        method: 'post',
        body: {
            cartId: cart?.id,
        },
        onSuccess: (result) => console.log('Added Product', result)
    });

    /* Variables */

    const hasProducts = products?.length > 0;

    /* Functions */

    const onAddProduct = (event: React.MouseEvent, product: FeaturedProductAttrs) => {
        event.stopPropagation();
        doRequest({ product })
    }
    
    const handleClick = (productId: string) => {
        console.log(productId)
        router.push(`/products/${productId}`)
    }

    /* Render */

    if (!hasProducts) return null;

    return (
        <ProductRow>
            {
                products.map(product => {
                    const price = product.price.toFixed(2).split(".");

                    const [euro, cents] = price;

                    return (
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3" key={product.id}>
                            <ProductDiv onClick={() => handleClick(product.id)}>
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
                                        onClick={(e) => onAddProduct(e, product)}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </CircleButton>
                                    <ProductTitle>
                                        {product.title}
                                    </ProductTitle>
                                </ProductArticle>
                            </ProductDiv>
                            {errors}
                        </div>
                    )
                })
            }
        </ProductRow>
    )
}