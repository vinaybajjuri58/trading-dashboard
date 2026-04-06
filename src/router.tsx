import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import StrategiesTable from './pages/StrategiesTable';
import StrategyDetail from './pages/StrategyDetail';
import ForwardTests from './pages/ForwardTests';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true,              element: <Overview /> },
      { path: 'strategies',       element: <StrategiesTable /> },
      { path: 'strategies/:id',   element: <StrategyDetail /> },
      { path: 'forward-tests',    element: <ForwardTests /> },
    ],
  },
]);
