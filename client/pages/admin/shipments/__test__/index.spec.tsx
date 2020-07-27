import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Shipments from '../';

describe('/admin/shipments', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<Shipments />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})