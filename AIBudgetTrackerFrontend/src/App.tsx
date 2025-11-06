import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import BudgetDashboard from './pages/BudgetDashboard';
import Analytics from './pages/Analytics';
import Export from './pages/Export';
import Forum from './pages/Forum';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<ProtectedRoute />}>
                        <Route path="" element={<Dashboard />} />
                    </Route>
                    <Route path="/profile" element={<ProtectedRoute />}>
                        <Route path="" element={<Profile />} />
                    </Route>
                    <Route path="/transactions" element={<ProtectedRoute />}>
                        <Route path="" element={<Transactions />} />
                    </Route>
                    <Route path="/budget" element={<ProtectedRoute />}>
                        <Route path="" element={<BudgetDashboard />} />
                    </Route>
                    <Route path="/analytics" element={<ProtectedRoute />}>
                        <Route path="" element={<Analytics />} />
                    </Route>
                    <Route path="/export" element={<ProtectedRoute />}>
                        <Route path="" element={<Export />} />
                    </Route>
                    <Route path="/forum" element={<ProtectedRoute />}>
                        <Route path="" element={<Forum />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;