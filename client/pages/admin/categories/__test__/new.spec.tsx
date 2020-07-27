import * as React from 'react';
import * as ReactDOM from 'react-dom';
import NewCategory from '../new';

describe('/admin/categories/new', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<NewCategory />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})