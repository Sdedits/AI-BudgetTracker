import React, { useState } from 'react';
import { Download, FileText, Table, Cloud } from 'lucide-react';
import { getTransactions } from '../services/api';

const ExportData: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const exportToCSV = async () => {
    try {
      setLoading(true);
      const response = await getTransactions();
      const transactions = response.data;

      // Filter by date if specified
      let filteredTransactions = transactions;
      if (startDate && endDate) {
        filteredTransactions = transactions.filter((t: any) => {
          const transactionDate = new Date(t.transactionDate);
          return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
        });
      }

      // Create CSV content
      const headers = ['ID', 'Type', 'Amount', 'Category', 'Description', 'Date'];
      const csvContent = [
        headers.join(','),
        ...filteredTransactions.map((t: any) => 
          [t.id, t.type, t.amount, t.category, t.description || '', t.transactionDate].join(',')
        )
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      alert('Failed to export data to CSV');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    try {
      setLoading(true);
      alert('PDF export feature coming soon! For now, please use the browser\'s print function (Ctrl+P) to save as PDF.');
      // In a real implementation, you would use a library like jsPDF or pdfmake
      // Example with jsPDF:
      // const doc = new jsPDF();
      // doc.text('Financial Report', 10, 10);
      // doc.save('report.pdf');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Failed to export data to PDF');
    } finally {
      setLoading(false);
    }
  };

  const backupToCloud = () => {
    alert('Cloud backup feature coming soon! This will allow you to backup your data to Google Drive or Dropbox.');
    // In a real implementation, you would integrate with Google Drive or Dropbox APIs
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Download className="text-blue-600" />
        Export & Backup
      </h2>

      {/* Date Range Filter */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-3">Date Range (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CSV Export */}
        <button
          onClick={exportToCSV}
          disabled={loading}
          className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all disabled:opacity-50"
        >
          <div className="flex flex-col items-center text-center">
            <Table className="text-green-600 mb-3" size={48} />
            <h3 className="font-semibold mb-2">Export to CSV</h3>
            <p className="text-sm text-gray-600">
              Download your transaction data in CSV format for use in Excel or other spreadsheet applications
            </p>
            <div className="mt-4 bg-green-100 text-green-700 px-4 py-2 rounded font-medium">
              Download CSV
            </div>
          </div>
        </button>

        {/* PDF Export */}
        <button
          onClick={exportToPDF}
          disabled={loading}
          className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all disabled:opacity-50"
        >
          <div className="flex flex-col items-center text-center">
            <FileText className="text-red-600 mb-3" size={48} />
            <h3 className="font-semibold mb-2">Export to PDF</h3>
            <p className="text-sm text-gray-600">
              Generate a formatted PDF report of your financial data for printing or archiving
            </p>
            <div className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded font-medium">
              Download PDF
            </div>
          </div>
        </button>

        {/* Cloud Backup */}
        <button
          onClick={backupToCloud}
          disabled={loading}
          className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all disabled:opacity-50"
        >
          <div className="flex flex-col items-center text-center">
            <Cloud className="text-blue-600 mb-3" size={48} />
            <h3 className="font-semibold mb-2">Cloud Backup</h3>
            <p className="text-sm text-gray-600">
              Backup your data securely to Google Drive or Dropbox for safe keeping
            </p>
            <div className="mt-4 bg-blue-100 text-blue-700 px-4 py-2 rounded font-medium">
              Setup Backup
            </div>
          </div>
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold mb-2 text-blue-900">Export Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• CSV files can be opened in Excel, Google Sheets, or any spreadsheet application</li>
          <li>• Use date range filter to export specific time periods</li>
          <li>• Regular backups help protect your financial data</li>
          <li>• PDF exports are great for sharing reports with financial advisors</li>
        </ul>
      </div>
    </div>
  );
};

export default ExportData;
