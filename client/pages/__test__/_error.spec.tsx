import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Error from '../_error';

describe('Error', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<Error />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})