import CartPage from "../../../view/cart/CartPage";
import ProdList from "../../../view/prod/list/ProdList";
import UserList from "../../../view/user/list/UserList";
import OrderList from "../../../view/order/list/OrderList";
import ShopList from "../../../view/shop/list/ShopList.jsx";
import ProdDetail from "../../../view/prod/detail/ProdDetail";
import SupList from "../../../view/supplier/list/SupList.jsx";
import ClientList from "../../../view/client/list/ClientList.jsx";
import SettingPage from "../../../view/setting/SettingPage";
import CoinPage from "../../../view/setting/coin/CoinPage.jsx";
import PaidTypePage from "../../../view/setting/paidType/PaidTypePage.jsx";
import CityPage from "../../../view/setting/city/CityPage.jsx";
import LogoutComp from "../../../view/auth/logout/LogoutComp.jsx";
import DashBoard from "../../../view/dashboard/DashBoard";
import FrontMB from "../../../view/@frontMobile/FrontMB";
import Purchase from "../../../view/purchase/Purchase";
import FrontAccount from "../../../view/@frontMobile/FrontAccount";
import SettingFront from "../../../view/settingFront/SettingFront";
import Pnome from "../../../view/setting/pnome/Pnome";
import ShopPage from "../../../view/setting/shop/ShopPage";
import TestPage from "../../../view/test/TestPage";
import Record from "../../../view/setting/record/Record";
import Home from "../../../view/home/Home.jsx";
const loginUrl = "/login";
const logoutUrl = "/logout";
const noAuthUrl = "/noAuth";
const homePage = "/B/homePage";
const backSettingRoutes = [
  {
    path: "/",
    element: <SettingPage type={-1} />,
    role: ["boss"],
  },
  {
    path: "/coin",
    element: <CoinPage />,
    role: ["boss"],
  },
  {
    path: "/paidType",
    element: <PaidTypePage />,
    role: ["boss"],
  },
  {
    path: "/cities",
    element: <CityPage />,
    role: ["boss"],
  },
  {
    path: "/pnome",
    element: <Pnome />,
    role: ["boss"],
  },
  {
    path: "/record",
    element: <Record />,
    role: ["boss"],
  },
  {
    path: "/shop",
    element: <ShopPage />,
    role: ["boss"],
  },
  { path: logoutUrl, element: <LogoutComp />, role: ["worker", "boss"] },
];

const backRoutes = {
  path: "/B",
  routes: [
    {
      path: "/test",
      element: <TestPage />,
      role: ["boss"],
    },
    {
      path: "/homePage",
      element: <Home />,
      role: ["boss"],
    },
    {
      path: "/dashboard",
      element: <DashBoard />,
      role: ["boss"],
    },
    // {
    //   path: "/purchase",
    //   element: <Purchase />,
    //   role: ["boss"],
    // },
    //order
    {
      path: "/orders",
      element: <OrderList section={-1} />,
      role: ["boss"],
    },

    {
      path: "/purOrders",
      element: <OrderList type={1} section={-1} />,
      role: ["boss"],
    },

    //prod
    {
      path: "/prods",
      element: <ProdList />,
      role: ["boss"],
    },
    {
      path: "/prods/:_id",
      element: <ProdDetail />,
      role: ["boss"],
    },
    //client
    {
      path: "/clients",
      element: <ClientList section={-1} />,
      role: ["boss"],
    },
    //user
    {
      path: "/users",
      element: <UserList />,
      role: ["boss"],
    },
    //shop
    {
      path: "/shops",
      element: <ShopList />,
      role: ["boss"],
    },
    {
      path: "/suppliers",
      element: <SupList section={-1} />,
      role: ["boss"],
    },
    {
      path: "/settings",
      subRoutes: backSettingRoutes,
      role: ["boss"],
    },
    {
      path: "/account",
      element: <FrontAccount type={null} />,
      role: ["boss"],
    },
  ],
};

const settingRoutes = { backSettingRoutes };

const routes = { backRoutes };
export default routes;
export { settingRoutes, loginUrl, logoutUrl, noAuthUrl, homePage };

// const routes = [
//   // {
//   //   path: "/order/:_id",
//   //   element: <>cart</>,
//   //   role: ["worker", "boss"],
//   // },
//   //
//   // {
//   //   path: "/purOrder/:_id",
//   //   element: <>cart</>,
//   //   role: ["worker", "boss"],
//   // },
//   // {
//   //   path: "/client/:_id",
//   //   element: <>client xxxx</>,
//   //   role: ["boss"],
//   // },
//   // {
//   //   path: "/user/:_id",
//   //   element: <>user xxxx</>,
//   //   role: ["boss"],
//   // },
//   // {
//   //   path: "/shop/:_id",
//   //   element: <>user xxxx</>,
//   //   role: ["boss"],
//   // },
//   // {
//   //   path: "/supplier/:_id",
//   //   element: <>user xxxx</>,
//   //   role: ["boss"],
//   // },
// ];
