import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Profile from '..';

describe('/profile', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<Profile />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})