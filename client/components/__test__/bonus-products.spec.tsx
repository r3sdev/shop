import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {FeaturedProducts} from '../featured-products';

describe('BonusProducts', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<FeaturedProducts  />, div);
        ReactDOM.unmountComponentAtNode(div);
    })
})