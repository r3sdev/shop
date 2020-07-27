import * as React from 'react';
import * as ReactDOM from 'react-dom';
import EditProduct from '../edit';

describe('/products/:id/edit', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<EditProduct />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})