import * as React from 'react';
import * as ReactDOM from 'react-dom';
import EmailVerificationSuccess from '../success';

describe('/auth/email/verification/success', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<EmailVerificationSuccess />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})