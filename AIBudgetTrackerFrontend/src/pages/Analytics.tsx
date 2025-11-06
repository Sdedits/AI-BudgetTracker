import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { getAnalytics } from '../services/api';

interface CategoryData {
  category: string;
  amount: number;
  color: string;
}

interface MonthlyData {
  month: string;
  amount: number;
}

interface IncomeExpenseData {
  month: string;
  income: number;
  expenses: number;
}

const Analytics: React.FC = () => {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [incomeExpenseData, setIncomeExpenseData] = useState<IncomeExpenseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [totalSpending, setTotalSpending] = useState(0);

  const categoryColors: { [key: string]: string } = {
    'Food': '#FF6384',
    'Transportation': '#36A2EB',
    'Entertainment': '#FFCE56',
    'Shopping': '#4BC0C0',
    'Bills': '#9966FF',
    'Healthcare': '#FF9F40',
    'Education': '#FF6384',
    'Other': '#C9CBCF'
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getAnalytics(selectedYear, selectedMonth);
      
      // Process category data
      if (response.data.categoryBreakdown && Array.isArray(response.data.categoryBreakdown)) {
        const catData = response.data.categoryBreakdown.map((item: any) => ({
          category: item.category,
          amount: parseFloat(item.totalAmount),
          color: categoryColors[item.category] || categoryColors['Other']
        }));
        setCategoryData(catData);
        setTotalSpending(catData.reduce((sum: number, cat: CategoryData) => sum + cat.amount, 0));
      } else {
        setCategoryData([]);
        setTotalSpending(0);
      }
      
      // Process monthly data
      if (response.data.monthlyTrend && Array.isArray(response.data.monthlyTrend)) {
        const monthData = response.data.monthlyTrend.map((item: any) => ({
          month: new Date(item.month).toLocaleDateString('default', { month: 'short' }),
          amount: parseFloat(item.totalAmount)
        }));
        setMonthlyData(monthData);
      } else {
        setMonthlyData([]);
      }
      
      // Process income vs expense data
      if (response.data.incomeVsExpenses && Array.isArray(response.data.incomeVsExpenses)) {
        const incExpData = response.data.incomeVsExpenses.map((item: any) => ({
          month: new Date(item.month).toLocaleDateString('default', { month: 'short' }),
          income: parseFloat(item.totalIncome),
          expenses: parseFloat(item.totalExpenses)
        }));
        setIncomeExpenseData(incExpData);
      } else {
        setIncomeExpenseData([]);
      }
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
      alert('Unable to load analytics data. Please make sure you have some transactions first and that the backend is running.');
      setCategoryData([]);
      setMonthlyData([]);
      setIncomeExpenseData([]);
      setTotalSpending(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedYear, selectedMonth]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Financial Analytics</h1>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-8 flex gap-4 items-center">
        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="p-2 border rounded"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="p-2 border rounded"
          >
            {months.map(month => (
              <option key={month} value={month}>
                {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={fetchAnalytics}
          className="ml-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Category Spending - Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="flex items-center gap-2 mb-6">
              <PieChartIcon className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold">
                Category-wise Spending - {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
            </div>
            
            {categoryData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No spending data available for the selected period
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) => 
                        `${category}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Category breakdown table */}
                <div>
                  <h3 className="font-semibold mb-4">Breakdown</h3>
                  <div className="space-y-2">
                    {categoryData.map((cat, index) => {
                      const percentage = (cat.amount / totalSpending) * 100;
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: cat.color }}
                            ></div>
                            <span className="font-medium">{cat.category}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">₹{cat.amount.toFixed(2)}</div>
                            <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between font-bold">
                      <span>Total Spending:</span>
                      <span>₹{totalSpending.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Income vs Expenses - Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold">Income vs Expenses - {selectedYear}</h2>
            </div>
            
            {incomeExpenseData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No income/expense data available for {selectedYear}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={incomeExpenseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="income" fill="#00C49F" name="Income" />
                  <Bar dataKey="expenses" fill="#FF8042" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Monthly Spending Trend - Line Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold">Monthly Spending Trend - {selectedYear}</h2>
            </div>
            
            {monthlyData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No spending trend data available for {selectedYear}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#0088FE" 
                    strokeWidth={3}
                    name="Spending"
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow text-white">
              <h3 className="text-sm opacity-90 mb-2">Average Monthly Spending</h3>
              <p className="text-3xl font-bold">
                ₹{monthlyData.length > 0 
                  ? (monthlyData.reduce((sum, m) => sum + m.amount, 0) / monthlyData.length).toFixed(2)
                  : '0.00'
                }
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow text-white">
              <h3 className="text-sm opacity-90 mb-2">Total Income ({selectedYear})</h3>
              <p className="text-3xl font-bold">
                ₹{incomeExpenseData.reduce((sum, m) => sum + m.income, 0).toFixed(2)}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-lg shadow text-white">
              <h3 className="text-sm opacity-90 mb-2">Total Expenses ({selectedYear})</h3>
              <p className="text-3xl font-bold">
                ₹{incomeExpenseData.reduce((sum, m) => sum + m.expenses, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
