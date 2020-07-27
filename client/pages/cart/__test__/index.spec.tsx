import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Cart from '..';

describe('/cart', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<Cart />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})