import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import routes, {
  homePage,
  loginUrl,
  logoutUrl,
  noAuthUrl,
} from "../config/general/router/routerConf";
import Login from "../view/auth/login/Login";
import LogoutComp from "../view/auth/logout/LogoutComp";

export default function Router() {
  const curRole = useSelector((state) => state.auth.userInfo?.role);
  return (
    <Routes>
      {/* {window.location.pathname.includes("index.html") && <Navigate to="/" />} */}
      <Route path={loginUrl} element={<Login />} />
      {/* front || back */}
      {Object.keys(routes)?.map((key) => {
        const subRoutes = routes[key];
        // console.log(subRoutes);
        return (
          <Route
            key={subRoutes.path}
            path={subRoutes.path + "/*"}
            element={
              <Routes>
                {subRoutes?.routes?.map((route) => {
                  return (
                    <Route
                      key={subRoutes.path + route.path}
                      path={route.path + (route.subRoutes ? "/*" : "")}
                      element={
                        route.subRoutes ? (
                          <Routes>
                            {route.subRoutes.map((subRoute) => (
                              <Route
                                key={subRoute.path + route.path}
                                path={subRoute.path}
                                element={
                                  <AuthRoute
                                    userRoles={subRoute.role}
                                    curRole={curRole}
                                  >
                                    {subRoute.element}
                                  </AuthRoute>
                                }
                              />
                            ))}
                          </Routes>
                        ) : (
                          <AuthRoute userRoles={route.role} curRole={curRole}>
                            {route.element}
                          </AuthRoute>
                        )
                      }
                    />
                  );
                })}
              </Routes>
            }
          />
        );
      })}
      <Route path={noAuthUrl} element={<>no permission</>} />
      <Route path={logoutUrl} element={<LogoutComp />} />
      <Route path="/" element={<Navigate to={homePage} />} />
      <Route path="*" element={<>not found</>} />
    </Routes>
  );
}

function AuthRoute({ userRoles, curRole: propsCurRole, children }) {
  let curRole;
  switch (propsCurRole) {
    case 101:
      curRole = "boss";
      break;
    case 105:
      curRole = "worker";
      break;
    default:
      break;
  }

  // const isLogin = useSelector((state) => state.auth.isLogin);
  // return children;
  // if (!isLogin) return <Navigate to={loginUrl} />;
  if (userRoles.indexOf(curRole) > -1) return children;
  else return <Navigate to={noAuthUrl} />;
}
