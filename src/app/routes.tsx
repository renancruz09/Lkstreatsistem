import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { NewSale } from "./pages/NewSale";
import { ProductRegister } from "./pages/ProductRegister";
import { CustomerRegister } from "./pages/CustomerRegister";
import { Reports } from "./pages/Reports";
import { Login } from "./pages/Login";
import { SalesHistory } from "./pages/SalesHistory";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { index: true, Component: Dashboard },
      { path: "nova-venda", Component: NewSale },
      { path: "historico-vendas", Component: SalesHistory },
      { path: "cadastro-produto", Component: ProductRegister },
      { path: "cadastro-cliente", Component: CustomerRegister },
      { path: "relatorios", Component: Reports },
    ],
  },
]);
