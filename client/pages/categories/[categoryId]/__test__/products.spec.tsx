import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CategoryProducts from '../products';

describe('/categories/:id/products', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<CategoryProducts />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})