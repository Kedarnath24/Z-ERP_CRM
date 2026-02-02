import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import Income from './income';
import Expenses from './expenses';
import RecurringExpenses from './recurring';
import ExpenseAllocation from './allocation';

export default function IncomeExpense() {
  const [location] = useLocation();

  const renderSubModule = () => {
    if (location.includes('/accounts/income-expense/income')) {
      return <Income />;
    } else if (location.includes('/accounts/income-expense/expenses')) {
      return <Expenses />;
    } else if (location.includes('/accounts/income-expense/recurring')) {
      return <RecurringExpenses />;
    } else if (location.includes('/accounts/income-expense/allocation')) {
      return <ExpenseAllocation />;
    }
    return <Income />;
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {renderSubModule()}
      </div>
    </DashboardLayout>
  );
}
