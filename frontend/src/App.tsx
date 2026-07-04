import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Verify from "@/pages/Verify";
import TaskFeed from "@/pages/TaskFeed";
import TaskComplete from "@/pages/TaskComplete";
import Earnings from "@/pages/Earnings";
import Payout from "@/pages/Payout";
import Admin from "@/pages/Admin";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/tasks" element={<TaskFeed />} />
          <Route path="/tasks/:id" element={<TaskComplete />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/payout" element={<Payout />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
