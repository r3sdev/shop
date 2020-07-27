import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ShowOrder from '../[orderId]';

describe('/orders/:id', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<ShowOrder />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})