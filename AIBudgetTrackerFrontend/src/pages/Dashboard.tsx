import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, getTransactions, getSavingsGoalProgress } from '../services/api';
import type { User, Transaction, SavingsGoalProgress } from '../types/index';
import { TrendingUp, TrendingDown, Wallet, Target, PiggyBank, ArrowRight, Lock } from 'lucide-react';

const Dashboard = () => {
    const [profile, setProfile] = useState<User | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [savingsGoals, setSavingsGoals] = useState<SavingsGoalProgress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const [profileRes, transactionsRes, savingsRes] = await Promise.all([
                    getProfile(token),
                    getTransactions(),
                    getSavingsGoalProgress().catch(() => ({ data: [] })) // Handle if savings goals don't exist
                ]);
                console.log('Profile:', profileRes.data);
                console.log('Transactions:', transactionsRes.data);
                console.log('Savings Goals:', savingsRes.data);
                setProfile(profileRes.data);
                setTransactions(transactionsRes.data || []);
                setSavingsGoals(savingsRes.data || []);
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
            alert('Failed to load dashboard data. Please check the console for details.');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotals = () => {
        // Ensure transactions is an array
        const safeTransactions = Array.isArray(transactions) ? transactions : [];
        const safeSavingsGoals = Array.isArray(savingsGoals) ? savingsGoals : [];
        
        const totalIncome = safeTransactions
            .filter(t => t.type === 'INCOME')
            .reduce((sum, t) => sum + (t.amount || 0), 0);
        
        const totalExpenses = safeTransactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + (t.amount || 0), 0);
        
        // Calculate total frozen savings from all savings goals
        const totalSavings = safeSavingsGoals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0);
        
        // Available balance: Income minus expenses minus frozen savings
        const netBalance = totalIncome - totalExpenses - totalSavings;
        
        return { 
            totalIncome, 
            totalExpenses, 
            totalSavings,
            netBalance
        };
    };

    const { totalIncome, totalExpenses, totalSavings, netBalance } = calculateTotals();
    const recentTransactions = Array.isArray(transactions) ? transactions.slice(0, 5) : [];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-lg text-gray-600 mt-1">Welcome back! Here's your financial overview</p>
            </div>

            {/* Info Banner */}
            {totalSavings > 0 && (
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6 rounded">
                    <div className="flex items-start">
                        <Lock className="text-purple-500 mt-0.5 mr-3" size={20} />
                        <div>
                            <h3 className="font-semibold text-purple-900">Savings are Frozen 🔒</h3>
                            <p className="text-sm text-purple-700 mt-1">
                                ₹{totalSavings.toLocaleString()} from your income is locked in savings goals and excluded from your available balance. 
                                This helps you reach your financial targets!
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-5 text-white">
                    <div className="flex items-center justify-between mb-3">
                        <div className="bg-white/20 p-3 rounded-lg">
                            <TrendingUp size={28} />
                        </div>
                    </div>
                    <p className="text-blue-100 text-base mb-1">Total Income</p>
                    <p className="text-3xl font-bold">₹{totalIncome.toLocaleString()}</p>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-5 text-white">
                    <div className="flex items-center justify-between mb-3">
                        <div className="bg-white/20 p-3 rounded-lg">
                            <TrendingDown size={28} />
                        </div>
                    </div>
                    <p className="text-red-100 text-base mb-1">Total Expenses</p>
                    <p className="text-3xl font-bold">₹{totalExpenses.toLocaleString()}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-5 text-white">
                    <div className="flex items-center justify-between mb-3">
                        <div className="bg-white/20 p-3 rounded-lg">
                            <Lock size={28} />
                        </div>
                    </div>
                    <p className="text-purple-100 text-base mb-1">Frozen Savings 🔒</p>
                    <p className="text-3xl font-bold">₹{totalSavings.toLocaleString()}</p>
                    <p className="text-xs text-purple-200 mt-1">Locked in {savingsGoals.length} goal{savingsGoals.length !== 1 ? 's' : ''}</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-5 text-white">
                    <div className="flex items-center justify-between mb-3">
                        <div className="bg-white/20 p-3 rounded-lg">
                            <Wallet size={28} />
                        </div>
                    </div>
                    <p className="text-green-100 text-base mb-1">Available Balance</p>
                    <p className="text-3xl font-bold">₹{netBalance.toLocaleString()}</p>
                    <p className="text-xs text-green-200 mt-1">After expenses & savings</p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Financial Goals */}
                <div className="bg-white rounded-xl shadow-lg p-5">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Financial Goals</h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Wallet className="text-blue-600" size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="text-base text-gray-600">Monthly Income</p>
                                <p className="font-bold text-lg text-gray-900">₹{(profile?.monthlyIncome || 0).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <PiggyBank className="text-green-600" size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="text-base text-gray-600">Savings Goal</p>
                                <p className="font-bold text-lg text-gray-900">₹{(profile?.savings || 0).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <Target className="text-purple-600" size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="text-base text-gray-600">Target Expenses</p>
                                <p className="font-bold text-lg text-gray-900">₹{(profile?.targetExpenses || 0).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <Link 
                        to="/profile"
                        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg font-semibold transition-all"
                    >
                        Update Goals
                        <ArrowRight size={20} />
                    </Link>
                </div>

                {/* Recent Transactions */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Recent Transactions</h2>
                        <Link 
                            to="/transactions"
                            className="text-blue-600 hover:text-blue-700 font-semibold text-base flex items-center gap-1"
                        >
                            View All
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                    
                    {recentTransactions.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-lg mb-3">No transactions yet</p>
                            <Link 
                                to="/transactions"
                                className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                            >
                                Add Your First Transaction
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentTransactions.map((transaction) => (
                                <div key={transaction.id} className={`p-4 rounded-lg border-l-4 ${
                                    transaction.type === 'INCOME' 
                                        ? 'bg-green-50 border-green-500' 
                                        : 'bg-red-50 border-red-500'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                {transaction.type === 'INCOME' ? (
                                                    <TrendingUp className="text-green-600" size={20} />
                                                ) : (
                                                    <TrendingDown className="text-red-600" size={20} />
                                                )}
                                                <h4 className="font-bold text-lg text-gray-900">{transaction.category}</h4>
                                            </div>
                                            {transaction.description && (
                                                <p className="text-base text-gray-600 mt-1">{transaction.description}</p>
                                            )}
                                            <p className="text-sm text-gray-500 mt-1">
                                                {new Date(transaction.transactionDate).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className={`text-2xl font-bold ${
                                            transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {transaction.type === 'INCOME' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
