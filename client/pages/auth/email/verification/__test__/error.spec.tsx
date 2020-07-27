import * as React from 'react';
import * as ReactDOM from 'react-dom';
import EmailVerificationError from '../error';

describe('/auth/email/verification/error', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<EmailVerificationError />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})