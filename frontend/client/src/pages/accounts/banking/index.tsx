import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import BankAccounts from "./bank-accounts";
import BankReconciliation from "./reconciliation";
import ChequeManagement from "./cheques";
import CashBankEntries from "./cash-bank";

export default function Banking() {
  const [location] = useLocation();

  const renderSubModule = () => {
    if (location.includes("/accounts/banking/accounts")) {
      return <BankAccounts />;
    }
    if (location.includes("/accounts/banking/reconciliation")) {
      return <BankReconciliation />;
    }
    if (location.includes("/accounts/banking/cheques")) {
      return <ChequeManagement />;
    }
    if (location.includes("/accounts/banking/cash-bank")) {
      return <CashBankEntries />;
    }
    return <BankAccounts />;
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {renderSubModule()}
      </div>
    </DashboardLayout>
  );
}
