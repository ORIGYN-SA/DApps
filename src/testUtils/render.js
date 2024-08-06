import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { createMemoryHistory } from 'history';

function customRender(children) {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    return render(<Router history={history}>{children}</Router>);
}

export { customRender as render };