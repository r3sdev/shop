import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CategoryId from '../[categoryId]';

describe('/admin/categories/:id', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<CategoryId />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})