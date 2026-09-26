import React from "react";
import { MapPin } from "lucide-react";

interface LocationPickerProps {
  lat: number;
  lng: number;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ lat, lng }) => {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2 text-right">
        الموقع على الخريطة
      </label>
      <div className="w-full h-64 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 relative">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
          title="Map"
        ></iframe>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <MapPin
            size={40}
            className="text-red-500 -mt-8 drop-shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
