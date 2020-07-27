import * as React from 'react';
import * as ReactDOM from 'react-dom';
import NewProduct from '../';

describe('/admin/products/new', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<NewProduct />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})