import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ResetPasswordToken from '../[resetPasswordToken]';

describe('/auth/reset-password/:token', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<ResetPasswordToken />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})