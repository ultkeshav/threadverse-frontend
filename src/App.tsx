import { Route, Routes } from "react-router-dom";

import About from "./pages/About";
import Collections from "./pages/Collections";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewDrops from "./pages/NewDrops";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Series from "./pages/Series";
import CartPage from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCollections from "./pages/admin/AdminCollections";
import AdminSeries from "./pages/admin/AdminSeries";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductDetails from "./pages/admin/AdminProductDetails";
// import AdminOrders from "./pages/admin/AdminOrders";

function App() {
  return (
    <Routes>
      {/* =========================
          USER ROUTES
          ========================= */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/collections"
        element={<Collections />}
      />

      <Route
        path="/series"
        element={<Series />}
      />

      <Route
        path="/products"
        element={<NewDrops />}
      />

      <Route
        path="/products/:productId"
        element={<ProductDetails />}
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/profile"
        element={<Profile />}
      />

      <Route
        path="/cart"
        element={<CartPage />}
      />

      <Route
        path="/checkout"
        element={<Checkout />}
      />

      <Route
        path="/orders"
        element={<Orders />}
      />

      <Route
        path="/orders/:orderId"
        element={<OrderDetails />}
      />

      {/* =========================
          ADMIN ROUTES
          ========================= */}

      <Route element={<AdminRoute />}>
        <Route
          path="/admin"
          element={<AdminLayout />}
        >
          {/* Dashboard */}
          <Route
            index
            element={<AdminDashboard />}
          />

          {/* Collections */}
          <Route
            path="collections"
            element={<AdminCollections />}
          />

          {/* Series */}
          <Route
            path="series"
            element={<AdminSeries />}
          />

          {/* Products */}
          <Route
            path="products"
            element={<AdminProducts />}
          />

          {/* Product Management */}
          <Route
            path="products/:productId"
            element={<AdminProductDetails />}
          />

          {/* Orders */}
         
        </Route>
      </Route>
    </Routes>
  );
}

export default App;