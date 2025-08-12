import { Outlet } from "react-router-dom";
import { CommonHeader } from "./commonHeader";
export function AuthLayout() {
    return (
        <>
            <CommonHeader />
            <div className="d-flex align-items-center py-4 bg-body-tertiary h-100 login-backdrop">
                <Outlet />
            </div>
        </>
    )
}