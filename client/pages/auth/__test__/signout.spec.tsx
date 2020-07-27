import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SignOut from '../signout';

describe('/auth/signout', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<SignOut />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})