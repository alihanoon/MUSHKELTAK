import React from "react";
import ServiceGrid from "./dashboard/ServiceGrid";

interface UserDashboardProps {
  complaintForm: any;
  setComplaintForm: (form: any) => void;
  iconMap: Record<string, any>;
  services: any[];
}

const UserDashboard: React.FC<UserDashboardProps> = ({
  complaintForm,
  setComplaintForm,
  iconMap,
  services,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full flex items-center py-8 md:py-12">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-25 pointer-events-none"
        style={{ backgroundImage: "url('/bgc 2.jpeg')" }}
      />
      
      {/* Content */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-2 md:mb-4">
            خدمات البلدية
          </h2>
          <p className="text-sm md:text-base text-gray-500">
            اختر الخدمة التي ترغب في تقديم طلب بشأنها
          </p>
        </div>

        <ServiceGrid
          complaintForm={complaintForm}
          setComplaintForm={setComplaintForm}
          iconMap={iconMap}
          services={services}
        />
      </main>
    </div>
  );
};

export default UserDashboard;
