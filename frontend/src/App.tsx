import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import BottomNav from "@/components/BottomNav";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Verify from "@/pages/Verify";
import Earnings from "@/pages/Earnings";
import Payout from "@/pages/Payout";
import Admin from "@/pages/Admin";
import Surveys from "@/pages/Surveys";
import Rewards from "@/pages/Rewards";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          {/* Tasks hidden until sponsors are secured — redirect to Earn */}
          <Route path="/tasks" element={<Navigate to="/earn" replace />} />
          <Route path="/tasks/:id" element={<Navigate to="/earn" replace />} />
          <Route path="/earn" element={<Surveys />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/payout" element={<Payout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/surveys" element={<Navigate to="/earn" replace />} />
          <Route path="/rewards" element={<Rewards />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </ThemeProvider>
  );
}
