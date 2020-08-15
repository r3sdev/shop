import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TwoFactAuth from '../two-factor-auth-confirm';

describe('2FA', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<TwoFactAuth />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})