import * as React from 'react';
import * as ReactDOM from 'react-dom';
import WithSidebar from '../with-sidebar';

describe('WithSidebar', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<WithSidebar />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})