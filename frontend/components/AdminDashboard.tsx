import React, { useState } from "react";
import { User, Complaint } from "../types";
import AdminStats from "./dashboard/AdminStats";
import ComplaintList from "./dashboard/ComplaintList";

interface AdminDashboardProps {
  user: User | null;
  complaints: Complaint[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, complaints }) => {
  const [filter, setFilter] = useState<"all" | "processing" | "resolved">("all");

  const displayedComplaints = complaints.filter(c => {
    if (filter === "all") return c.status === 1;
    if (filter === "processing") return c.status === 2 || c.status === 3;
    if (filter === "resolved") return c.status === 4 || c.status === 5;
    return true;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="space-y-8 md:space-y-12">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-2 md:mb-4">
            {user?.role === 1 ? "لوحة تحكم المسؤول" : "لوحة تحكم الموظف"}
          </h2>
          <p className="text-sm md:text-base text-gray-500">متابعة وإدارة جميع المعاملات المقدمة</p>
        </div>

        <AdminStats 
          complaints={complaints} 
          filter={filter} 
          setFilter={setFilter} 
        />

        <ComplaintList
          complaints={displayedComplaints}
        />
      </div>
    </main>
  );
};

export default AdminDashboard;
