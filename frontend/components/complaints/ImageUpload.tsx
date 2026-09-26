import React from "react";
import { Plus } from "lucide-react";

interface ImageUploadProps {
  image: string;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ image, handleImageUpload }) => {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2 text-right">
        إرفاق صورة (اختياري)
      </label>
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all overflow-hidden relative">
          {image ? (
            <img
              src={image}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Plus className="w-8 h-8 mb-4 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500 font-bold">
                اضغط لرفع صورة
              </p>
            </div>
          )}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
