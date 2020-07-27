import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ShowCategory from '../[categoryId]';

describe('/categories/:id', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<ShowCategory />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})