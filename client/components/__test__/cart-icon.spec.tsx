import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CartIcon from '../cart-icon';

describe('CartIcon', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<CartIcon />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})