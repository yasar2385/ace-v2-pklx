import { Outlet } from "react-router-dom";
import { CommonFooter } from "./commonFooter";
import { CommonHeader } from "./commonHeader";

export function CommonLayout() {
    return (
        <>
            <CommonHeader />
            <Outlet />
            <CommonFooter />
        </>
    )
}