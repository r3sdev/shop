import * as React from 'react';
import * as ReactDOM from 'react-dom';
import BonusProducts from '../bonus-products';

describe('BonusProducts', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
            <BonusProducts products={[]} cart={{id: 'test'}} currentUser={null} />
            , div);
        ReactDOM.unmountComponentAtNode(div);
    })
})