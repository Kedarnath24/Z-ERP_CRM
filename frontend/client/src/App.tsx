import ErrorBoundary from "@/components/ErrorBoundary";
import TopProgressBar from "@/components/TopProgressBar";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import DashboardOverview from "@/pages/dashboard-overview";
import NotFound from "@/pages/not-found";

// Purchase Module Pages
import PurchaseRequisitions from "@/pages/purchases/purchase-requisitions";
import Suppliers from "@/pages/purchases/suppliers";
import Quotations from "@/pages/purchases/quotations";
import PurchaseOrders from "@/pages/purchases/purchase-orders";
import GoodsReceiptNotes from "@/pages/purchases/goods-receipt-notes";
import PurchaseInvoices from "@/pages/purchases/purchase-invoices";
import PurchaseReports from "@/pages/purchases/purchase-reports";

// Projects Module Pages
import ProjectsList from "@/pages/projects/projects-list";
import ProjectDetail from "@/pages/projects/project-detail";

// HRM Module Pages
import HRMDashboard from "@/pages/hrm/hrm-dashboard";
import HRMEmployees from "@/pages/hrm/hrm-employees";
import HRMAttendance from "@/pages/hrm/hrm-attendance";
import HRMPayroll from "@/pages/hrm/hrm-payroll";
import HRMInsurance from "@/pages/hrm/hrm-insurance";
import HRMPerformance from "@/pages/hrm/hrm-performance";
import HRMLetters from "@/pages/hrm/hrm-letters";
import HRMTravelExpense from "@/pages/hrm/hrm-travel-expense";
import HRMAutomation from "@/pages/hrm/hrm-automation";

// Sales Module Pages
import SalesDashboard from "@/pages/sales/sales-dashboard";

// Accounts Module Pages
import Banking from "@/pages/accounts/banking/index";
import IncomeExpense from "@/pages/accounts/income-expense/index";
import Receivables from "@/pages/accounts/receivables/index";
import Payables from "@/pages/accounts/payables/index";
import AccountsReports from "@/pages/accounts/reports/index";
import AccountSettings from "@/pages/accounts/settings/index";
import AccountsDashboard from "@/pages/accounts/accounts-dashboard";

// Recruitment Module Pages
import RecruitmentDashboard from "@/pages/recruitment/recruitment-dashboard";

// Customers Module Pages
import CustomersDashboard from "@/pages/customers/customers-dashboard";

// Contracts Module Pages
import ContractsDashboard from "@/pages/contracts/contracts-dashboard";

// Vendors Module Pages
import VendorsLanding from "@/pages/vendors/VendorsLanding";

// Products Module Pages
import ProductsDashboard from "@/pages/products/ProductsDashboard";

// Profile Module Pages
import EmployeeProfile from "@/pages/profile/EmployeeProfile";

// Remote Desk Monitoring Pages
import RemoteDeskMonitoring from "@/pages/monitoring/RemoteDeskMonitoring";

// New Enterprise Components
import AttendanceDashboard from "@/pages/attendance/AttendanceDashboard";
import OrganizationsManagement from "@/pages/organizations/OrganizationsManagement";

// New Z-ERP Modules
import FlipBookLibrary from "@/pages/flipbook/FlipBookLibrary";
import FlipBookViewer from "@/pages/flipbook/FlipBookViewer";
import FieldStaffTracking from "@/pages/fieldstaff/FieldStaffTracking";
import SubscriptionManagement from "@/pages/subscriptions/SubscriptionManagement";
import LeadsWorkflow from "@/pages/leads/LeadsWorkflow";
import SuperAdminDashboard from "@/pages/superadmin/SuperAdminDashboard";
import AdminSetup from "@/pages/admin/AdminSetup";
import WorkflowAutomation from "@/pages/workflow/WorkflowAutomation";

// WhatsApp Module Pages
import {
  Connect,
  Settings,
  WABAConfig,
  MarketingCampaigns,
  BotFlows,
  Conversations,
  BotAnalytics,
} from "@/pages/whatsapp";

// Bookings Module Pages
import Appointments from "@/pages/bookings/Appointments";
import Callbacks from "@/pages/bookings/Callbacks";
import TimeSlots from "@/pages/bookings/TimeSlots";
import BookingCalendar from "@/pages/bookings/Calendar";
import FormInfo from "@/pages/bookings/FormInfo";

// Contacts Module
import ContactsList from "@/pages/contacts/ContactsList";

// Finance Module
import TaxRates from "@/pages/finance/TaxRates";
import Currency from "@/pages/finance/Currency";
import PaymentModes from "@/pages/finance/PaymentModes";
import ExpenseCategories from "@/pages/finance/ExpenseCategories";

// Estimate Requests Module
import EstimateRequests from "@/pages/estimates/EstimateRequests";

// Email Module
import EmailTemplates from "@/pages/email/EmailTemplates";
import EmailIntegration from "@/pages/email/EmailIntegration";

// Setup Module
import StaffSetup from "@/pages/setup/StaffSetup";
import GroupsSetup from "@/pages/setup/GroupsSetup";
import LeadSetup from "@/pages/setup/LeadSetup";
import WebToLead from "@/pages/setup/WebToLead";

// Custom Links Module
import CustomLinks from "@/pages/customlinks/CustomLinks";

// Customer Groups
import CustomerGroups from "@/pages/customers/customer-groups";

// Lead Sources & Status
import LeadSources from "@/pages/leads/lead-sources";
import LeadStatus from "@/pages/leads/lead-status";

// Contract Types
import ContractTypes from "@/pages/contracts/contract-types";

// Settings Module
import SettingsDashboard from "@/pages/settings/SettingsDashboard";
import GeneralSettings from "@/pages/settings/GeneralSettings";
import EmailSettingsPage from "@/pages/settings/EmailSettings";
import ESignSettings from "@/pages/settings/ESignSettings";
import FinanceSettings from "@/pages/settings/FinanceSettings";
import LeadsSettings from "@/pages/settings/LeadsSettings";

import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";

// No authentication required - all routes are accessible

function Router() {
  return (
    <Switch>
      {/* Root - Dashboard */}
      <Route path="/" component={DashboardOverview} />
      
      {/* Main Module Routes - Matching Sidebar */}
      <Route path="/projects" component={ProjectsList} />
      <Route path="/projects/:id" component={ProjectDetail} />
      
      {/* HRM Module Routes */}
      <Route path="/hrm" component={HRMDashboard} />
      <Route path="/hrm/employees" component={HRMEmployees} />
      <Route path="/hrm/attendance" component={HRMAttendance} />
      <Route path="/hrm/payroll" component={HRMPayroll} />
      <Route path="/hrm/insurance" component={HRMInsurance} />
      <Route path="/hrm/performance" component={HRMPerformance} />
      <Route path="/hrm/letters" component={HRMLetters} />
      <Route path="/hrm/travel-expense" component={HRMTravelExpense} />
      <Route path="/hrm/automation" component={HRMAutomation} />
      
      {/* Sales Module Routes */}
      <Route path="/sales" component={SalesDashboard} />
      <Route path="/sales/proposals" component={SalesDashboard} />
      <Route path="/sales/estimates" component={SalesDashboard} />
      <Route path="/sales/invoices" component={SalesDashboard} />
      <Route path="/sales/payment-slips" component={SalesDashboard} />
      
      {/* Accounts Module Routes */}
      <Route path="/accounts/banking/:rest*" component={Banking} />
      <Route path="/accounts/banking" component={Banking} />
      <Route path="/accounts/income-expense/:rest*" component={IncomeExpense} />
      <Route path="/accounts/income-expense" component={IncomeExpense} />
      <Route path="/accounts/income" component={IncomeExpense} />
      <Route path="/accounts/expenses" component={IncomeExpense} />
      <Route path="/accounts/receivables/:rest*" component={Receivables} />
      <Route path="/accounts/receivables" component={Receivables} />
      <Route path="/accounts/payables/:rest*" component={Payables} />
      <Route path="/accounts/payables" component={Payables} />
      <Route path="/accounts/reports" component={AccountsReports} />
      <Route path="/accounts/settings" component={AccountSettings} />
      <Route path="/accounts" component={AccountsDashboard} />
      
      {/* Recruitment Module Routes */}
      <Route path="/recruitment" component={RecruitmentDashboard} />
      <Route path="/recruitment/jobs" component={RecruitmentDashboard} />
      <Route path="/recruitment/schedule" component={RecruitmentDashboard} />
      <Route path="/recruitment/candidates" component={RecruitmentDashboard} />
      <Route path="/recruitment/ai-matching" component={RecruitmentDashboard} />
      
      {/* Customers Module Routes */}
      <Route path="/customers" component={CustomersDashboard} />
      <Route path="/customers/leads" component={CustomersDashboard} />
      <Route path="/customers/list" component={CustomersDashboard} />
      <Route path="/customers/communication" component={CustomersDashboard} />
      <Route path="/customers/groups" component={CustomerGroups} />
      
      {/* Contracts Module Routes */}
      <Route path="/contracts" component={ContractsDashboard} />
      <Route path="/contracts/active" component={ContractsDashboard} />
      <Route path="/contracts/renewals" component={ContractsDashboard} />
      <Route path="/contracts/alerts" component={ContractsDashboard} />
      <Route path="/contracts/types" component={ContractTypes} />
      <Route path="/purchases" component={PurchaseRequisitions} />
      <Route path="/purchases/requisitions" component={PurchaseRequisitions} />
      <Route path="/purchases/suppliers" component={Suppliers} />
      <Route path="/purchases/quotations" component={Quotations} />
      <Route path="/purchases/orders" component={PurchaseOrders} />
      <Route path="/purchases/goods-receipts" component={GoodsReceiptNotes} />
      <Route path="/purchases/invoices" component={PurchaseInvoices} />
      <Route path="/purchases/reports" component={PurchaseReports} />
      <Route path="/vendors" component={VendorsLanding} />
      <Route path="/vendors/list" component={VendorsLanding} />
      <Route path="/vendors/payments" component={VendorsLanding} />
      <Route path="/vendors/documentation" component={VendorsLanding} />
      <Route path="/products" component={ProductsDashboard} />
      <Route path="/profile" component={EmployeeProfile} />
      <Route path="/remote-desk" component={RemoteDeskMonitoring} />
      
      {/* Attendance Module */}
      <Route path="/attendance" component={AttendanceDashboard} />
      <Route path="/attendance/check-in" component={AttendanceDashboard} />
      <Route path="/attendance/history" component={AttendanceDashboard} />
      
      {/* Organizations Module */}
      <Route path="/organizations" component={OrganizationsManagement} />
      <Route path="/organizations/list" component={OrganizationsManagement} />
      <Route path="/organizations/add" component={OrganizationsManagement} />
      
      {/* Flip Book Module */}
      <Route path="/flipbook" component={FlipBookLibrary} />
      <Route path="/flipbook/library" component={FlipBookLibrary} />
      <Route path="/flipbook/viewer/:id" component={FlipBookViewer} />
      
      {/* Bookings Module */}
      <Route path="/dashboard/bookings/appointments" component={Appointments} />
      <Route path="/dashboard/bookings/callbacks" component={Callbacks} />
      <Route path="/dashboard/bookings/time-slots" component={TimeSlots} />
      <Route path="/dashboard/bookings/calendar" component={BookingCalendar} />
      <Route path="/dashboard/bookings/form-info" component={FormInfo} />
      
      {/* Contacts Module */}
      <Route path="/dashboard/contacts" component={ContactsList} />
      
      {/* Finance Module */}
      <Route path="/dashboard/finance/tax-rates" component={TaxRates} />
      <Route path="/dashboard/finance/currency" component={Currency} />
      <Route path="/dashboard/finance/payment-modes" component={PaymentModes} />
      <Route path="/dashboard/finance/expense-categories" component={ExpenseCategories} />
      
      {/* Estimate Requests Module */}
      <Route path="/dashboard/estimates" component={EstimateRequests} />
      
      {/* Email Module */}
      <Route path="/dashboard/email/templates" component={EmailTemplates} />
      <Route path="/dashboard/email/integration" component={EmailIntegration} />
      
      {/* Setup Module */}
      <Route path="/dashboard/setup/staff" component={StaffSetup} />
      <Route path="/dashboard/setup/groups" component={GroupsSetup} />
      <Route path="/dashboard/setup/lead-setup" component={LeadSetup} />
      <Route path="/dashboard/setup/web-to-lead" component={WebToLead} />
      
      {/* Custom Links Module */}
      <Route path="/dashboard/custom-links" component={CustomLinks} />
      
      {/* Field Staff Tracking Module */}
      <Route path="/fieldstaff" component={FieldStaffTracking} />
      <Route path="/fieldstaff/live-map" component={FieldStaffTracking} />
      <Route path="/fieldstaff/movement-history" component={FieldStaffTracking} />
      <Route path="/fieldstaff/geofence" component={FieldStaffTracking} />
      <Route path="/fieldstaff/proof-of-visit" component={FieldStaffTracking} />
      <Route path="/fieldstaff/attendance" component={FieldStaffTracking} />
      <Route path="/fieldstaff/tasks" component={FieldStaffTracking} />
      <Route path="/fieldstaff/expenses" component={FieldStaffTracking} />
      
      {/* WhatsApp Module Routes */}
      <Route path="/dashboard/whatsapp/connect" component={Connect} />
      <Route path="/dashboard/whatsapp/settings" component={Settings} />
      <Route path="/dashboard/whatsapp/waba-config" component={WABAConfig} />
      <Route path="/dashboard/whatsapp/marketing-campaigns" component={MarketingCampaigns} />
      <Route path="/dashboard/whatsapp/bot-flows" component={BotFlows} />
      <Route path="/dashboard/whatsapp/conversations" component={Conversations} />
      <Route path="/dashboard/whatsapp/bot-analytics" component={BotAnalytics} />
      
      {/* Subscription Management Module */}
      <Route path="/subscriptions" component={SubscriptionManagement} />
      <Route path="/subscriptions/catalog" component={SubscriptionManagement} />
      <Route path="/subscriptions/customers" component={SubscriptionManagement} />
      <Route path="/subscriptions/invoicing" component={SubscriptionManagement} />
      <Route path="/subscriptions/renewals" component={SubscriptionManagement} />
      <Route path="/subscriptions/analytics" component={SubscriptionManagement} />
      
      {/* Leads & Workflow Module */}
      <Route path="/leads" component={LeadsWorkflow} />
      <Route path="/leads/intake" component={LeadsWorkflow} />
      <Route path="/leads/scoring" component={LeadsWorkflow} />
      <Route path="/leads/assignment" component={LeadsWorkflow} />
      <Route path="/leads/nurture" component={LeadsWorkflow} />
      <Route path="/leads/sources" component={LeadSources} />
      <Route path="/leads/status" component={LeadStatus} />
      
      {/* Workflow Automation Module */}
      <Route path="/workflow" component={WorkflowAutomation} />
      <Route path="/workflow/builder" component={WorkflowAutomation} />
      <Route path="/workflow/active" component={WorkflowAutomation} />
      <Route path="/workflow/analytics" component={WorkflowAutomation} />
      
      {/* Super Admin Module */}
      <Route path="/superadmin" component={SuperAdminDashboard} />
      <Route path="/superadmin/organizations" component={SuperAdminDashboard} />
      <Route path="/superadmin/modules" component={SuperAdminDashboard} />
      <Route path="/superadmin/system" component={SuperAdminDashboard} />
      <Route path="/superadmin/audit" component={SuperAdminDashboard} />
      
      {/* Admin Setup Module */}
      <Route path="/admin" component={AdminSetup} />
      <Route path="/admin/company" component={AdminSetup} />
      <Route path="/admin/domain" component={AdminSetup} />
      <Route path="/admin/users" component={AdminSetup} />
      <Route path="/admin/permissions" component={AdminSetup} />
      
      {/* Settings Module */}
      <Route path="/dashboard/settings" component={SettingsDashboard} />
      <Route path="/dashboard/settings/general" component={GeneralSettings} />
      <Route path="/dashboard/settings/email" component={EmailSettingsPage} />
      <Route path="/dashboard/settings/esign" component={ESignSettings} />
      <Route path="/dashboard/settings/finance" component={FinanceSettings} />
      <Route path="/dashboard/settings/leads" component={LeadsSettings} />
      
      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}function App() {
  useEffect(() => {
    // Global error handler to catch unhandled promise rejections
    const handleError = (event: ErrorEvent) => {
      console.error('❌ GLOBAL ERROR CAUGHT:');
      console.error('Message:', event.message);
      console.error('Error:', event.error);
      console.error('Filename:', event.filename);
      console.error('Line:', event.lineno, 'Column:', event.colno);
      console.error('Stack:', event.error?.stack);
      event.preventDefault(); // Prevent default browser error handling
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('❌ UNHANDLED PROMISE REJECTION:');
      console.error('Reason:', event.reason);
      console.error('Promise:', event.promise);
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WorkspaceProvider>
            <TooltipProvider>
              <ErrorBoundary>
                <Toaster />
                <TopProgressBar />
                <Router />
              </ErrorBoundary>
            </TooltipProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
