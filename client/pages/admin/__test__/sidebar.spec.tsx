import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Sidebar from '../sidebar';

describe('Sidebar', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<Sidebar />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})