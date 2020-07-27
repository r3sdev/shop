import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Admin from '../'

describe('/admin', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<Admin />, div);
        ReactDOM.unmountComponentAtNode(div);
    })
})