import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import LayoutPage from "./components/LayoutPage";
import DashBoardPage from "./components/pages/dashboard/DashBoardPage ";
import StickerGeneratorPage from "./components/pages/sticker-generator/StickerGeneratorPage";
import AdminConfigPage from "./components/pages/admin-config/AdminConfigPage";
import InventoryPage from "./components/pages/inventory/InventoryPage";
import DispatchPage from "./components/pages/dispatch/DispatchPage";
import DispatchedHistoryPage from "./components/pages/dispatched-history/DispatchedHistoryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LayoutPage />}>
          <Route index element={<DashBoardPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/sticker-generator" element={<StickerGeneratorPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/dispatch" element={<DispatchPage />} />
          <Route path="/dispatched-history" element={<DispatchedHistoryPage />} />
          <Route path="/admin-config" element={<AdminConfigPage />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
