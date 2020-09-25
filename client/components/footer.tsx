import React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faPinterestP, faYoutube, faCcPaypal, faCcAmex, faCcMastercard, faCcVisa } from '@fortawesome/free-brands-svg-icons';
import { faWineGlass, faBan } from '@fortawesome/free-solid-svg-icons';

const FooterContainer = styled.footer`
    padding-top: 5rem;
    padding-bottom: 5rem;
    width: 100%;
    background: #f5f5f5;
    padding-left: 15px;
    padding-right: 15px;
`

const FooterMenuHeader = styled.h5`
    font-weight: bold;
    padding-bottom: 1rem;
`

const FooterMenuLink = styled.a`
    display: flex;
    cursor: pointer;
    color: #303030;
    height: 32px;

    &:hover {
        color: #00ade6;
        text-decoration: none; /* no underline */
    }
    &:focus {
        color: black;
        text-decoration: none; /* no underline */
    }
    &:active {
        color: black;
        text-decoration: none; /* no underline */
    }
    &:visited {
        color: black;
        text-decoration: none; /* no underline */
    }
    &:link {
        color: black;
        text-decoration: none; /* no underline */
    }
    
`

const FooterSocialContainer = styled.div`
    margin-top: 1rem;
    font-size: 24px;
`

const FooterIcon = styled(FontAwesomeIcon)`
    cursor: pointer;
    color: #303030;
    &:hover {
        color: #00ade6;
        text-decoration: none; /* no underline */
    }
`

const FooterImg = styled.img`
    height: 50px;
`

const FooterTOSContainer = styled.div`
    @media (max-width: 768px) {
        flex-direction: column;
    };
`

const FooterImgContainer = styled.div`
    padding-left: 15px;
    .fa-stack {
        font-size: 18px;
    }
`

const FooterPaymentIconsContainer = styled.div`
    font-size: 24px;
`

const Footer = () => {
    return (
        <FooterContainer>
            <Row>
                <Col md="3" lg="3">
                    <FooterMenuHeader>Groceries</FooterMenuHeader>
                    <Link href="/products">
                        <FooterMenuLink>Products</FooterMenuLink>
                    </Link>
                    <Link href="/brands">
                        <FooterMenuLink>Brands</FooterMenuLink>
                    </Link>
                    <Link href="/bonus">
                        <FooterMenuLink>Bonus</FooterMenuLink>
                    </Link>
                    <Link href="/stores">
                        <FooterMenuLink>Stores</FooterMenuLink>
                    </Link>
                    <Link href="/order-online">
                        <FooterMenuLink>Order online</FooterMenuLink>
                    </Link>
                    <Link href="/delivery-service">
                        <FooterMenuLink>Delivery service</FooterMenuLink>
                    </Link>
                    <Link href="/pick-up-points">
                        <FooterMenuLink>Pick up points</FooterMenuLink>
                    </Link>
                    <Link href="/b2b-orders">
                        <FooterMenuLink>B2B orders</FooterMenuLink>
                    </Link>
                    <Link href="/mygroceryph-app">
                        <FooterMenuLink>MyGroceryPH app</FooterMenuLink>
                    </Link>
                    <Link href="/mygroceryph-assistant">
                        <FooterMenuLink>MyGroceryPH assistant</FooterMenuLink>
                    </Link>
                    <Link href="/wine-selector">
                        <FooterMenuLink>Wine selector</FooterMenuLink>
                    </Link>
                    <Link href="/mygroceryph-delivery-subscription">
                        <FooterMenuLink>MyGroceryPH delivery subscription</FooterMenuLink>
                    </Link>
                </Col>
                <Col md="3" lg="3">
                    <FooterMenuHeader>Magazine</FooterMenuHeader>
                    <Link href="/recipes">
                        <FooterMenuLink>Recipes</FooterMenuLink>
                    </Link>
                    <Link href="/mygroceryph-box">
                        <FooterMenuLink>MyGroceryPH box</FooterMenuLink>
                    </Link>
                    <Link href="/videos">
                        <FooterMenuLink>Videos</FooterMenuLink>
                    </Link>
                    <Link href="/themes">
                        <FooterMenuLink>Themes</FooterMenuLink>
                    </Link>
                    <Link href="/my-recipes">
                        <FooterMenuLink>My recipes</FooterMenuLink>
                    </Link>
                    <Link href="/kids">
                        <FooterMenuLink>Kids</FooterMenuLink>
                    </Link>
                    <Link href="/magazine-app">
                        <FooterMenuLink>Magazine app</FooterMenuLink>
                    </Link>
                    <Link href="/about-mygroceryph-box">
                        <FooterMenuLink>About MyGroceryPH box</FooterMenuLink>
                    </Link>
                </Col>
                <Col md="3" lg="3">
                    <FooterMenuHeader>Service</FooterMenuHeader>
                    <Link href="/customer-service">
                        <FooterMenuLink>Customer service</FooterMenuLink>
                    </Link>
                    <Link href="/my-mygroceryph-com">
                        <FooterMenuLink>My mygroceryph.com</FooterMenuLink>
                    </Link>
                    <Link href="/my-bonus">
                        <FooterMenuLink>My bonus</FooterMenuLink>
                    </Link>
                    <Link href="/photo-service">
                        <FooterMenuLink>Photo service</FooterMenuLink>
                    </Link>
                    <Link href="/mobile-topup">
                        <FooterMenuLink>Mobile topup</FooterMenuLink>
                    </Link>
                    <Link href="/gift-cards">
                        <FooterMenuLink>Gift cards</FooterMenuLink>
                    </Link>
                    <Link href="/dry-cleaning">
                        <FooterMenuLink>Dry cleaning</FooterMenuLink>
                    </Link>
                    <Link href="/postal-service">
                        <FooterMenuLink>Postal service</FooterMenuLink>
                    </Link>
                    <Link href="/lottery">
                        <FooterMenuLink>Lottery</FooterMenuLink>
                    </Link>
                </Col>
                <Col md="3" lg="3">
                    <FooterMenuHeader>MyGroceryPH</FooterMenuHeader>
                    <Link href="/promotions">
                        <FooterMenuLink>Promotions</FooterMenuLink>
                    </Link>
                    <Link href="/newsletter">
                        <FooterMenuLink>Newsletter</FooterMenuLink>
                    </Link>
                    <Link href="/advertise">
                        <FooterMenuLink>Advertise</FooterMenuLink>
                    </Link>
                    <Link href="/press">
                        <FooterMenuLink>Press</FooterMenuLink>
                    </Link>
                    <Link href="/jobs">
                        <FooterMenuLink>Jobs</FooterMenuLink>
                    </Link>
                    <Link href="/mygroceryph-brands">
                        <FooterMenuLink>MyGroceryPH brands</FooterMenuLink>
                    </Link>
                    <Link href="/all-brands">
                        <FooterMenuLink>All brands</FooterMenuLink>
                    </Link>
                    <Link href="/quality-control">
                        <FooterMenuLink>Quality control</FooterMenuLink>
                    </Link>
                    <Link href="/sustainability">
                        <FooterMenuLink>Sustainability</FooterMenuLink>
                    </Link>
                    <Link href="/more-about-products">
                        <FooterMenuLink>More about products</FooterMenuLink>
                    </Link>
                    <Link href="/mygroceryph-foundation">
                        <FooterMenuLink>MyGroceryPH foundation</FooterMenuLink>
                    </Link>
                </Col>
            </Row>

            <FooterSocialContainer className="d-flex align-items-center justify-content-center mt-5">
                <FooterIcon icon={faFacebookF} fixedWidth className="ml-1" />
                <FooterIcon icon={faTwitter} fixedWidth className="ml-1" />
                <FooterIcon icon={faInstagram} fixedWidth className="ml-1" />
                <FooterIcon icon={faYoutube} fixedWidth className="ml-1" />
                <FooterIcon icon={faPinterestP} fixedWidth className="ml-1" />

                <FooterImg
                    src="https://cdn-ramsy-dev.ams3.cdn.digitaloceanspaces.com/images/mygroceryph-cropped.png"
                    alt="mygroceryph.com"
                    className="img-fluid ml-5"
                />
            </FooterSocialContainer>


            <FooterTOSContainer className="d-flex align-items-center justify-content-center mt-5">
                <Link href="/terms-of-service">
                    <FooterMenuLink className="ml-3">Terms of Service</FooterMenuLink>
                </Link>
                <Link href="/bonus-terms">
                    <FooterMenuLink className="ml-3">Bonus terms</FooterMenuLink>
                </Link>
                <Link href="/privacy-policy">
                    <FooterMenuLink className="ml-3">Privacy policy</FooterMenuLink>
                </Link>
                <Link href="/cookie-policy">
                    <FooterMenuLink className="ml-3">Cookie policy</FooterMenuLink>
                </Link>
                <Link href="/about-mygroceryph">
                    <FooterMenuLink className="ml-3">About MyGroceryPH</FooterMenuLink>
                </Link>
                <Link href="/responsible-disclosure">
                    <FooterMenuLink className="ml-3">Responsible disclosure</FooterMenuLink>
                </Link>
            </FooterTOSContainer>
            
            <div className="d-flex align-items-center justify-content-between mt-5">
                <FooterImgContainer className="d-flex align-items-center justify-content-between mt-2">
                    <div className="d-flex align-items-center">
                        <div className="fa-stack fa-2x">
                            <FontAwesomeIcon icon={faWineGlass} className="fa-stack-1x" />
                            <FontAwesomeIcon icon={faBan} className="fa-stack-2x" color="Tomato" />
                        </div>
                    </div>
                    <small className="ml-3">
                        Under 21? No Tobacco! No Vapor! No Alcohol!
                    </small>
                </FooterImgContainer>

                <FooterPaymentIconsContainer>
                    <FooterIcon icon={faCcPaypal} fixedWidth className="ml-1" />
                    <FooterIcon icon={faCcAmex} fixedWidth className="ml-1" />
                    <FooterIcon icon={faCcMastercard} fixedWidth className="ml-1" />
                    <FooterIcon icon={faCcVisa} fixedWidth className="ml-1" />
                </FooterPaymentIconsContainer>
            </div>


        </FooterContainer>
    )
}

export { Footer };