import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Categories from '../';

describe('/categories', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<Categories />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})