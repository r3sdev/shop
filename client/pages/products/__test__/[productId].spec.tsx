import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ShowProduct from '../[productId]';

describe('/products/:id', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<ShowProduct />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})