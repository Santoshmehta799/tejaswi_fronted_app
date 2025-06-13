import { IoHomeSharp } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { FaBarcode } from "react-icons/fa6";
import { GrDocumentConfig } from "react-icons/gr";
import { MdInventory2 } from "react-icons/md";
import { PiPackageFill } from "react-icons/pi";
import { MdOutlineManageHistory } from "react-icons/md";
import Cookies from "js-cookie";

const allLinks = [
    {
        id: "dashboard",
        title: "DashBoard",
        path: "/",
        icon: <IoHomeSharp style={{ width: "20px" }} />
    },
    {
        id: "register_user",
        title: "Register User",
        path: "/register",
        icon: <FaUserPlus style={{ width: "20px" }} />
    },
    {
        id: "sticker_generator",
        title: "Sticker Generator",
        path: "/sticker-generator",
        icon: <FaBarcode style={{ width: "16px" }} />
    },
    {
        id: "inventory",
        title: "Inventory",
        path: "/inventory",
        icon: <MdInventory2 style={{ width: "20px" }} />
    },
    {
        id: "dispatch",
        title: "Dispatch",
        path: "/dispatch",
        icon: <PiPackageFill style={{ width: "22px" }} />
    },
    {
        id: "dispatched_history",
        title: "Dispatched History",
        path: "/dispatched-history",
        icon: <MdOutlineManageHistory style={{ width: "22px" }} />
    },
    {
        id: "admin_config",
        title: "Admin Config",
        path: "/admin-config",
        icon: <GrDocumentConfig style={{ width: "19px" }} />
    },
];

const rolePermissions = {
    admin: "ALL",
    sticker_guys: ["dashboard", "sticker_generator", "inventory"],
    dispatch_guys: ["dashboard", "dispatch", "dispatched_history"],
};


export const getNavbarContext = () => {
    const role = Cookies.get("role");
    const allowed = rolePermissions[role];

    return {
        links: allowed === "ALL" ? allLinks : allLinks.filter(link => allowed?.includes(link.id))
    };
};




