import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faAngleRight } from '@fortawesome/free-solid-svg-icons';

const NotificationContainer = styled.div`
    align-items: center;
    background: #fcdd9c;
    border-bottom: 1px solid #f6f4f0;
    display: flex;
    height: ${(props: { height: string }) => props.height ? `${props.height}` : '42.25px'};
    padding-left: 25px;
    padding-right: 25px;
    transition: height, .5s;
    width: 100%;
    cursor: pointer;
`


export const Notification = () => {

    const [height, setHeight] = React.useState('0');

    const isClosed = height === '0'

    const handleClose = () => {
        setHeight('0');
    }


    React.useEffect(() => {
        setTimeout(() => {
            setHeight('42.25px')
        }, 300)
    },[])
    

    return (
        <NotificationContainer height={height}>
            {!isClosed && (
                <div className="d-flex align-items-center w-100">
                    <div className="d-flex align-items-center">
                        <span>
                        Want to make sure you are able to order online? Choose your delivery moment first
                        </span>
                        <span className="ml-1">
                            <FontAwesomeIcon icon={faAngleRight} />
                        </span>
                    </div>
                    <div onClick={handleClose} className="d-flex ml-auto">
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </NotificationContainer>
    )
}