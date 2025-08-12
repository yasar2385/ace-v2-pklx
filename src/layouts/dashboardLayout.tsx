
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

import { DashboardHeader } from "./dashboardHeader";
import { ChangePasswordCanvas } from "../components/changePasswordCanvas";
import { UserProfileCanvas } from "../components/userProfileCanvas";

export function DashboardLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    document.getElementsByTagName("body")[0].classList.add("dashboardLayout");
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
    return () => {
      document
        .getElementsByTagName("body")[0]
        .classList.remove("dashboardLayout");
    };
  }, []);
  return (
    <>
      <DashboardHeader />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            {localStorage.getItem("isLoggedIn") ? (
              <Outlet />
            ) : (
              <Navigate to={"/login"} />
            )}
          </div>
        </div>
      </div>

      <UserProfileCanvas />
      <ChangePasswordCanvas />
    </>
  );
}
