import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SignIn from '../signin';

describe('/auth/signin', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<SignIn />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})