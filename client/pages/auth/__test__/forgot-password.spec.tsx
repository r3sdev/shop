import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ForgotPassword from '../forgot-password';

describe('/auth/forgot-password', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<ForgotPassword />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})