import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Error404 from '../404';

describe('Error 404', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<Error404 />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})