import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SignedOut from '../signed-out';

describe('/auth/signed-out', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<SignedOut />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})