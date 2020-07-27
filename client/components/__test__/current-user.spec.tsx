import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CurrentUser from '../current-user';

describe('CurrentUser', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<CurrentUser />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})