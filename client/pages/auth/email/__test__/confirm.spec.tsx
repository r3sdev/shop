import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ConfirmEmail from '../confirm';

describe('/auth/email/confirm', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<ConfirmEmail />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})