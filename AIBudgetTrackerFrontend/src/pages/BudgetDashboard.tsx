import React from 'react';
import BudgetManager from '../components/BudgetManager';
import SavingsGoals from '../components/SavingsGoals';

const BudgetDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Budget & Savings</h1>
      
      <div className="space-y-8">
        <div>
          <BudgetManager />
        </div>
        
        <div>
          <SavingsGoals />
        </div>
      </div>
    </div>
  );
};

export default BudgetDashboard;
