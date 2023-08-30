import { Outlet } from 'react-router-dom';
import Layout from './components/common/Layout/Layout';
import Header from './components/common/Header/Header';

function App() {
  return (
    <Layout>
      <Header />
      <Outlet />
    </Layout>
  );
}

export default App;
