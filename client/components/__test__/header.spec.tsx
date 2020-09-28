import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Header } from '../header';

describe('Header', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<Header />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})