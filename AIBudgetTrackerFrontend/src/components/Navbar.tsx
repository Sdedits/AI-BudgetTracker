import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Wallet, User, LogOut, Home, TrendingUp, PieChart, BarChart3, Download, MessageCircle } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="w-full px-0">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            <Wallet className="text-blue-600" size={32} />
                            Budget Tracker
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600">
                                    <Home size={20} />
                                    <span className="font-medium">Dashboard</span>
                                </Link>
                                <Link to="/transactions" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600">
                                    <TrendingUp size={20} />
                                    <span className="font-medium">Transactions</span>
                                </Link>
                                <Link to="/budget" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600">
                                    <PieChart size={20} />
                                    <span className="font-medium">Budget</span>
                                </Link>
                                <Link to="/analytics" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600">
                                    <BarChart3 size={20} />
                                    <span className="font-medium">Analytics</span>
                                </Link>
                                <Link to="/export" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600">
                                    <Download size={20} />
                                    <span className="font-medium">Export</span>
                                </Link>
                                <Link to="/forum" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600">
                                    <MessageCircle size={20} />
                                    <span className="font-medium">Forum</span>
                                </Link>
                                <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600">
                                    <User size={20} />
                                    <span className="font-medium">Profile</span>
                                </Link>
                                <button 
                                    onClick={logout} 
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                                >
                                    <LogOut size={20} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/signup" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;