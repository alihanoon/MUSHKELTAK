import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";


interface ServiceGridProps {
  complaintForm: any;
  setComplaintForm: (form: any) => void;
  iconMap: Record<string, any>;
  services: any[];
}

const ServiceGrid: React.FC<ServiceGridProps> = ({
  complaintForm,
  setComplaintForm,
  iconMap,
  services,
}) => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      {services.map((service) => {
        const Icon = iconMap[service.icon] || iconMap["FileText"];
        return (
          <motion.div
            key={service._id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setComplaintForm({ ...complaintForm, type: service._id });
              navigate("/new-complaint");
            }}
            className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6 cursor-pointer group"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-[#D4AF37] rounded-2xl md:rounded-3xl shadow-lg flex items-center justify-center text-white transition-all group-hover:shadow-xl group-hover:bg-[#C5A028]">
              <Icon strokeWidth={1.5} className="w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12" />
            </div>
            <span className="text-base sm:text-lg font-bold text-gray-700 text-center group-hover:text-[#D4AF37] transition-colors">
              {service.name}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ServiceGrid;
