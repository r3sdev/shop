import * as React from 'react';
import * as ReactDOM from 'react-dom';
import EditCategory from '../edit';

describe('/categories/:id/edit', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<EditCategory />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})