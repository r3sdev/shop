import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SignUp from '../signup';

describe('/auth/signup', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<SignUp />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})