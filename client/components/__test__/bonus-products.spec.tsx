import * as React from 'react';
import * as ReactDOM from 'react-dom';
import BonusProducts from '../bonus-products';

describe('BonusProducts', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<BonusProducts  />, div);
        ReactDOM.unmountComponentAtNode(div);
    })
})