import React from 'react';
import { Package } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Financial Analytics</h1>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
        <Package className="mx-auto mb-4 text-yellow-600" size={64} />
        <h2 className="text-2xl font-bold mb-4 text-yellow-800">Charts Require Installation</h2>
        <p className="text-yellow-700 mb-6">
          The Analytics page requires additional libraries to display beautiful visualizations.
        </p>
        <div className="bg-white p-4 rounded border border-yellow-300 mb-4">
          <p className="font-semibold mb-2">To enable charts, run:</p>
          <code className="bg-gray-800 text-green-400 px-4 py-2 rounded block">
            npm install recharts react-hook-form @tanstack/react-query date-fns
          </code>
        </div>
        <div className="mt-6 text-left bg-white p-4 rounded border border-gray-200">
          <h3 className="font-bold mb-2">What you'll get after installation:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>📊 Monthly spending comparison (Line Chart)</li>
            <li>🥧 Category-wise spending breakdown (Pie Chart)</li>
            <li>📈 Income vs Expenses comparison (Bar Chart)</li>
            <li>🎯 Interactive tooltips and filters</li>
            <li>📈 Summary statistics and insights</li>
          </ul>
        </div>
        <div className="mt-6 bg-blue-50 p-4 rounded border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> After installing dependencies, restart your development server with <code className="bg-blue-100 px-2 py-1 rounded">npm run dev</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
