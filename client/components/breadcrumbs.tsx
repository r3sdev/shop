import React from 'react';
import styled from 'styled-components';

const BreadcrumbsContainer = styled.div`
    height: 48px;
    width: 100%;
    background: #f9f7f5;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-left: 25px;
    padding-right: 25px;
`

export const Breadcrumbs = () => {
    return (
        <BreadcrumbsContainer>
            Breadcrumbs
        </BreadcrumbsContainer>
    )
}