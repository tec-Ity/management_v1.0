const backNav = {
  base: "/B",
  defaultLink: "/homePage",
  links: [
    //! only for testing
    // {
    //   to: "test",
    //   label: "test",
    //   // label: "test",
    //   role: ["boss"],
    // },
    {
      to: "homePage",
      label: "homePage",
      // label: "dashboard",
      role: ["boss"],
    },
    {
      to: "dashboard",
      label: "dashboard",
      // label: "dashboard",
      role: ["boss"],
    },
    {
      to: "prods",
      label: "prods",
      // label: "prod list",
      role: ["boss"],
    },
    {
      to: "orders",
      label: "orders",
      // label: "order",
      role: ["boss"],
    },
    // {
    //   to: "purchase",
    //   label: "purchase",
    //   // label: "purchase",
    //   showMB: false,
    //   role: ["worker", "boss"],
    // },

    {
      to: "purOrders",
      label: "purOrders",
      // label: "purchase orders",
      role: ["worker", "boss"],
    },
    {
      to: "suppliers",
      label: "suppliers",
      // label: "supplier list",
      role: ["boss"],
    },
    {
      to: "clients",
      label: "clients",
      // label: "client",
      role: ["boss"],
    },

    {
      to: "users",
      label: "users",
      // label: "user list",
      role: ["boss"],
    },
    // {
    //   to: "shops",
    //   label: "shops",
    //   // label: "shop list",
    //   role: ["boss"],
    // },

    {
      to: "settings",
      label: "settings",
      // label: "settings",
      role: ["boss"],
    },
  ],
};

const loginNav = {
  to: "login",
  label: "login",
  // label: "Log In",
  role: ["boss", "worker"],
};

const logoutNav = {
  to: "logout",
  label: "logout",
  // label: "Log Out",
  role: ["boss", "worker"],
};

const navigations = { backNav };

export { loginNav, logoutNav };

export default navigations;
