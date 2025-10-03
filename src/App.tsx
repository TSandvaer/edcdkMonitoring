import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { DashboardHome } from './pages/DashboardHome';
import { IndexPages } from './pages/IndexPages';
import { Frontpage } from './pages/Frontpage';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-dark-purple-900">
        <Sidebar />
        <div className="ml-64 flex-1">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/index-pages" element={<IndexPages />} />
            <Route path="/frontpage" element={<Frontpage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
