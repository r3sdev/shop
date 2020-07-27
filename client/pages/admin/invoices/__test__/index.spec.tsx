import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Invoices from '../';

describe('/admin/invoices', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        // @ts-ignore
        ReactDOM.render(<Invoices />, div)
        ReactDOM.unmountComponentAtNode(div);
    })
})