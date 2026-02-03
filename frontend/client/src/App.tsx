import ErrorBoundary from "@/components/ErrorBoundary";
import TopProgressBar from "@/components/TopProgressBar";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
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
import AccountsModule from "@/pages/accounts/index";

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

function AppRouter() {
  return (
    <Switch>
      {/* Roots and Modules */}
      <Route path="/" component={DashboardOverview} />
      
      {/* Accounts Module Routes - Delegate all /accounts paths */}
      <Route path="/accounts/*" component={AccountsModule} />
      <Route path="/accounts" component={AccountsModule} />

      {/* Main Module Routes */}
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route path="/projects" component={ProjectsList} />
      
      {/* HRM Module Routes */}
      <Route path="/hrm/employees" component={HRMEmployees} />
      <Route path="/hrm/attendance" component={HRMAttendance} />
      <Route path="/hrm/payroll" component={HRMPayroll} />
      <Route path="/hrm/insurance" component={HRMInsurance} />
      <Route path="/hrm/performance" component={HRMPerformance} />
      <Route path="/hrm/letters" component={HRMLetters} />
      <Route path="/hrm/travel-expense" component={HRMTravelExpense} />
      <Route path="/hrm/automation" component={HRMAutomation} />
      <Route path="/hrm/*" component={HRMDashboard} />
      <Route path="/hrm" component={HRMDashboard} />
      
      <Route path="/sales/*" component={SalesDashboard} />
      <Route path="/sales" component={SalesDashboard} />
      
      <Route path="/recruitment/*" component={RecruitmentDashboard} />
      <Route path="/recruitment" component={RecruitmentDashboard} />
      
      <Route path="/customers/*" component={CustomersDashboard} />
      <Route path="/customers" component={CustomersDashboard} />
      
      <Route path="/contracts/*" component={ContractsDashboard} />
      <Route path="/contracts" component={ContractsDashboard} />
      
      <Route path="/purchases/*" component={PurchaseRequisitions} />
      <Route path="/purchases" component={PurchaseRequisitions} />
      <Route path="/vendors/*" component={VendorsLanding} />
      <Route path="/vendors" component={VendorsLanding} />
      <Route path="/products/*" component={ProductsDashboard} />
      <Route path="/products" component={ProductsDashboard} />
      <Route path="/profile/*" component={EmployeeProfile} />
      <Route path="/profile" component={EmployeeProfile} />
      <Route path="/remote-desk/*" component={RemoteDeskMonitoring} />
      <Route path="/remote-desk" component={RemoteDeskMonitoring} />
      
      {/* Attendance Module */}
      <Route path="/attendance/*" component={AttendanceDashboard} />
      <Route path="/attendance" component={AttendanceDashboard} />
      
      {/* Organizations Module */}
      <Route path="/organizations/*" component={OrganizationsManagement} />
      <Route path="/organizations" component={OrganizationsManagement} />
      
      {/* Flip Book Module */}
      <Route path="/flipbook/*" component={FlipBookLibrary} />
      <Route path="/flipbook" component={FlipBookLibrary} />
      
      {/* Bookings Module */}
      <Route path="/dashboard/bookings/*" component={Appointments} />
      
      {/* Contacts Module */}
      <Route path="/dashboard/contacts/*" component={ContactsList} />
      <Route path="/dashboard/contacts" component={ContactsList} />
      
      {/* Finance Module */}
      <Route path="/dashboard/finance/*" component={TaxRates} />
      
      {/* Estimate Requests Module */}
      <Route path="/dashboard/estimates/*" component={EstimateRequests} />
      <Route path="/dashboard/estimates" component={EstimateRequests} />
      
      {/* Email Module */}
      <Route path="/dashboard/email/*" component={EmailTemplates} />
      
      {/* Setup Module */}
      <Route path="/dashboard/setup/*" component={StaffSetup} />
      
      {/* Custom Links Module */}
      <Route path="/dashboard/custom-links/*" component={CustomLinks} />
      <Route path="/dashboard/custom-links" component={CustomLinks} />
      
      {/* Field Staff Tracking Module */}
      <Route path="/fieldstaff/*" component={FieldStaffTracking} />
      <Route path="/fieldstaff" component={FieldStaffTracking} />
      
      {/* WhatsApp Module Routes */}
      <Route path="/dashboard/whatsapp/*" component={Connect} />
      
      {/* Subscription Management Module */}
      <Route path="/subscriptions/*" component={SubscriptionManagement} />
      <Route path="/subscriptions" component={SubscriptionManagement} />
      
      {/* Leads & Workflow Module */}
      <Route path="/leads/sources" component={LeadSources} />
      <Route path="/leads/status" component={LeadStatus} />
      <Route path="/leads/*" component={LeadsWorkflow} />
      <Route path="/leads" component={LeadsWorkflow} />
      
      {/* Workflow Automation Module */}
      <Route path="/workflow/*" component={WorkflowAutomation} />
      <Route path="/workflow" component={WorkflowAutomation} />
      
      {/* Super Admin Module */}
      <Route path="/superadmin/*" component={SuperAdminDashboard} />
      <Route path="/superadmin" component={SuperAdminDashboard} />
      
      {/* Admin Setup Module */}
      <Route path="/admin/*" component={AdminSetup} />
      <Route path="/admin" component={AdminSetup} />
      
      {/* Settings Module */}
      <Route path="/dashboard/settings/*" component={SettingsDashboard} />
      <Route path="/dashboard/settings" component={SettingsDashboard} />
      
      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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
          <NotificationProvider>
            <TooltipProvider>
              <ErrorBoundary>
                <Toaster />
                <AppRouter />
              </ErrorBoundary>
            </TooltipProvider>
          </NotificationProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
