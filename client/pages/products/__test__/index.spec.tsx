import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Products from '..';

describe('/products', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<Products />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})