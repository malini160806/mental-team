import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Reflect from './pages/Reflect';
import Insights from './pages/Insights';
import Breathe from './pages/Breathe';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reflect" element={<Reflect />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/breathe" element={<Breathe />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
