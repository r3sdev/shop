import * as React from 'react';
import * as ReactDOM from 'react-dom';
import EditProduct from '../edit';

describe('EditProduct', () => {
    it('/admin/products/:id/edit', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<EditProduct />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})