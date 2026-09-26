import React from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, FileText, ChevronLeft } from "lucide-react";
import { Complaint, STATUS_MAP } from "../types";

interface SearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  complaints: Complaint[];
}

const Search: React.FC<SearchProps> = ({
  searchQuery,
  setSearchQuery,
  complaints,
}) => {
  const navigate = useNavigate();
  const filtered = complaints.filter(c => 
    c.complaintNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-right" dir="rtl">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-2xl font-black text-gray-800 mb-6">البحث عن معاملة</h2>
        <div className="relative">
          <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            className="w-full pr-12 pl-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-lg"
            placeholder="أدخل رقم المعاملة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {searchQuery && filtered.map(c => (
          <div
            key={c._id}
            onClick={() => {
              navigate(`/complaints/${c._id}`);
            }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <FileText size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{c.complaintNumber}</h4>
                <p className="text-xs text-gray-400 mt-1">{c.type} | {c.municipality}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${STATUS_MAP[c.status].color}`}>
                {STATUS_MAP[c.status].label}
              </span>
              <ChevronLeft size={20} className="text-gray-300" />
            </div>
          </div>
        ))}
        {searchQuery && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">لم يتم العثور على معاملات بهذا الرقم</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Search;
