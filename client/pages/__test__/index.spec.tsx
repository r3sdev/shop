import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Root from '..';

describe('/', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<Root />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})