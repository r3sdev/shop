import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Orders from '..';

describe('/admin/orders', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    // @ts-ignore
    ReactDOM.render(<Orders />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
