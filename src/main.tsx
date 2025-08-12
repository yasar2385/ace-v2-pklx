import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Provider } from 'react-redux';
import { store } from './store/index.ts';
import { PrimeReactProvider } from 'primereact/api';
import { RouterProvider } from 'react-router-dom';
import { browserRoutes } from './core/routes.tsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';

import 'bootstrap';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}> {/* Redux Provider to pass the store */}
      <PrimeReactProvider> {/* PrimeReact Provider */}
        <RouterProvider router={browserRoutes} /> {/* React Router provider */}
      </PrimeReactProvider>
    </Provider>
  </StrictMode>
)
