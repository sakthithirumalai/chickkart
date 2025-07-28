import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import CartStateManager from "./components/ui/CartStateManager";
// Add your imports here
import AdminLogin from "./pages/admin-login";
import UpiPaymentConfirmation from "./pages/upi-payment-confirmation";
import ShoppingCartCheckout from "./pages/shopping-cart-checkout";
import CustomerMenuBrowse from "./pages/customer-menu-browse";
import AdminDashboardOrderManagement from "./pages/admin-dashboard-order-management";
import NotFound from "./pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <CartStateManager>
        <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your routes here */}
          <Route path="/" element={<CustomerMenuBrowse />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/upi-payment-confirmation" element={<UpiPaymentConfirmation />} />
          <Route path="/shopping-cart-checkout" element={<ShoppingCartCheckout />} />
          <Route path="/customer-menu-browse" element={<CustomerMenuBrowse />} />
          <Route path="/admin-dashboard-order-management" element={<AdminDashboardOrderManagement />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
        </ErrorBoundary>
      </CartStateManager>
    </BrowserRouter>
  );
};

export default Routes;