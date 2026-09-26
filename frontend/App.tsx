import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { 
  Recycle, 
  HardHat, 
  TrafficCone, 
  ClipboardCheck, 
  ShoppingBag, 
  TreePine,
  FileText
} from "lucide-react";
import { User, Complaint, Notification } from "./types";
import { ToastContainer, toast } from 'react-toastify';
import { validatePassword } from "./utils/passwordValidator";
import 'react-toastify/dist/ReactToastify.css';

// Components
import Auth from "./components/Auth";
import Navbar from "./components/Navbar";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import MyRequests from "./components/MyRequests";
import Search from "./components/Search";
import NewComplaint from "./components/NewComplaint";
import ComplaintDetails from "./components/ComplaintDetails";
import UsersManagement from "./components/UsersManagement";
import PermissionsManagement from "./components/PermissionsManagement";
import LandingPage from "./components/LandingPage";

const ICON_MAP: Record<string, any> = {
  Recycle,
  HardHat,
  TrafficCone,
  ClipboardCheck,
  ShoppingBag,
  TreePine,
  FileText
};

const ComplaintDetailsWrapper = ({ complaints, user, responseForm, setResponseForm, handleUpdateStatus, loading }: any) => {
  const { id } = useParams();
  const complaint = complaints.find((c: any) => c._id === id) || null;
  return <ComplaintDetails 
    selectedComplaint={complaint} 
    user={user} 
    responseForm={responseForm} 
    setResponseForm={setResponseForm} 
    handleUpdateStatus={(e: React.FormEvent) => handleUpdateStatus(e, id)} 
    loading={loading} 
  />;
};

const AdminRoute = ({ children, user }: any) => {
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 1 && user.role !== 2) return <Navigate to="/user-dashboard" replace />;
  return children;
};

const UserRoute = ({ children, user }: any) => {
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 3) return <Navigate to="/admin-dashboard" replace />;
  return children;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [governorates, setGovernorates] = useState<any[]>([]);
  const [municipalities, setMunicipalities] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "", phone: "", role: 3, city: "", municipality: "" });
  const [complaintForm, setComplaintForm] = useState({
    type: "",
    city: "",
    municipality: "",
    description: "",
    image: "",
    location: { lat: 31.9454, lng: 35.9284, address: "" }
  });

  useEffect(() => {
    if (location.pathname === "/new-complaint") {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setComplaintForm(prev => ({
              ...prev,
              location: {
                ...prev.location,
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
            }));
          },
          (error) => console.error("Error getting location:", error)
        );
      }
    }
  }, [location.pathname]);

  const [responseForm, setResponseForm] = useState({
    status: 1,
    response: "",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.role === 1 || parsedUser.role === 2) {
        if (location.pathname === '/' || location.pathname === '/login') navigate("/admin-dashboard");
        if (parsedUser.role === 1) fetchUsers(parsedUser.token);
      } else {
        if (location.pathname === '/' || location.pathname === '/login') navigate("/user-dashboard");
      }
      fetchComplaints(parsedUser.token);
      fetchNotifications(parsedUser.token);
    }
    setIsAppLoading(false);
  }, []);

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const govRes = await fetch("/api/lookups/governorates");
        const munRes = await fetch("/api/lookups/municipalities");
        const srvRes = await fetch("/api/lookups/services");
        
        if (govRes.ok) setGovernorates(await govRes.json());
        if (munRes.ok) setMunicipalities(await munRes.json());
        if (srvRes.ok) setServices(await srvRes.json());
      } catch (err) {
        console.error("Error fetching lookups:", err);
      }
    };
    fetchLookups();
  }, []);


  const fetchUsers = useCallback(async (token: string) => {
  try {
    const res = await fetch("/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      setUsers(data); 
    }
  } catch (err) {
    console.error("خطأ في جلب المستخدمين:", err);
  }
}, []);


useEffect(() => {
  // إذا كان المستخدم مسجلاً ولديه توكن، اجلب البيانات فوراً إذا كان أدمن
  if (user?.token && user.role === 1) {
    fetchUsers(user.token);
  }
}, [user?.token, user?.role, fetchUsers]);


  const fetchComplaints = async (token: string) => {
    try {
      const res = await fetch("/api/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setComplaints(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async (token: string) => {
    try {
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const endpoint = location.pathname === "/login" ? "/api/users/login" : "/api/users";
    
    if (endpoint === "/api/users") {
      const passwordValidation = validatePassword(authForm.password);
      if (!passwordValidation.isValid) {
        setError(passwordValidation.message);
        toast.error(passwordValidation.message);
        setLoading(false);
        return;
      }
    }
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authForm),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        navigate(data.role === 1 || data.role === 2 ? "/admin-dashboard" : "/user-dashboard");
        fetchComplaints(data.token);
        fetchNotifications(data.token);
        toast.success(location.pathname === "/login" ? "تم تسجيل الدخول بنجاح" : "تم إنشاء الحساب بنجاح");
      } else {
        setError(data.message || "حدث خطأ ما");
        toast.error(data.message || "حدث خطأ ما");
      }
    } catch (err) {
      setError("فشل الاتصال بالخادم");
      toast.error("فشل الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent, complaintId: string) => {
    e.preventDefault();
    if (!user || !complaintId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/complaints/${complaintId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(responseForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setComplaints(complaints.map(c => c._id === updated._id ? updated : c));
        setResponseForm({ status: 1, response: "" });
        toast.success("تم تحديث الحالة بنجاح");
      } else {
        toast.error("فشل في تحديث الحالة");
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setComplaintForm({ ...complaintForm, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateComplaint = async (e: React.FormEvent, status: number = 1) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ ...complaintForm, status }),
      });
      if (res.ok) {
        navigate(user.role === 1 || user.role === 2 ? "/admin-dashboard" : "/user-dashboard");
        fetchComplaints(user.token);
        fetchNotifications(user.token);
        setComplaintForm({ type: "", city: "", municipality: "", description: "", image: "", location: { lat: 31.9454, lng: 35.9284, address: "" } });
        toast.success("تم إرسال الشكوى بنجاح");
      } else {
        setError("فشل في إرسال المعاملة، يرجى المحاولة لاحقاً");
        toast.error("فشل في إرسال المعاملة، يرجى المحاولة لاحقاً");
      }
    } catch (err) {
      setError("فشل الاتصال بالخادم، يرجى التحقق من الاتصال");
      toast.error("فشل الاتصال بالخادم، يرجى التحقق من الاتصال");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== 1) return;
    
    const passwordValidation = validatePassword(authForm.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      toast.error(passwordValidation.message);
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("/api/users/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(authForm),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers([...users, data]);
        setAuthForm({ name: "", email: "", password: "", phone: "", role: 3, city: "", municipality: "" });
        toast.success("تم إضافة المستخدم بنجاح");
      } else {
        setError(data.message || "فشل إضافة المستخدم");
        toast.error(data.message || "فشل إضافة المستخدم");
      }
    } catch (err) {
      setError("فشل الاتصال بالخادم");
      toast.error("فشل الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
    toast.info("تم تسجيل الخروج", { autoClose: 1500 });
  };

  if (isAppLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <AnimatePresence mode="wait">
        {(location.pathname === "/login" || location.pathname === "/register") && (
          <Auth
            error={error}
            loading={loading}
            authForm={authForm}
            setAuthForm={setAuthForm}
            handleAuth={handleAuth}
          />
        )}
        {location.pathname === "/" && !user && (
          <LandingPage />
        )}
        {location.pathname !== "/login" && location.pathname !== "/register" && (location.pathname !== "/" || user) && (
          <div className="min-h-screen bg-gray-50">
            <Navbar
              user={user}
              notifications={notifications}
              showNotifications={showNotifications}
              setShowNotifications={setShowNotifications}
              logout={logout}
            />
            <Routes>
              <Route path="/" element={<Navigate to={user ? (user.role === 1 || user.role === 2 ? "/admin-dashboard" : "/user-dashboard") : "/login"} replace />} />
              <Route path="/admin-dashboard" element={
                <AdminRoute user={user}>
                  <AdminDashboard user={user} complaints={complaints} />
                </AdminRoute>
              } />
              <Route path="/user-dashboard" element={
                <UserRoute user={user}>
                  <UserDashboard complaintForm={complaintForm} setComplaintForm={setComplaintForm} iconMap={ICON_MAP} services={services} />
                </UserRoute>
              } />
              <Route path="/new-complaint" element={<NewComplaint complaintForm={complaintForm} setComplaintForm={setComplaintForm} handleCreateComplaint={handleCreateComplaint} handleImageUpload={handleImageUpload} loading={loading} governorates={governorates} municipalities={municipalities} services={services} />} />
              <Route path="/complaints/:id" element={<ComplaintDetailsWrapper complaints={complaints} user={user} responseForm={responseForm} setResponseForm={setResponseForm} handleUpdateStatus={handleUpdateStatus} loading={loading} />} />
              <Route path="/my-requests" element={<MyRequests complaints={complaints} />} />
              <Route path="/search" element={<Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} complaints={complaints} />} />
              <Route path="/users" element={<UsersManagement users={users} authForm={authForm} setAuthForm={setAuthForm} handleAdminCreateUser={handleAdminCreateUser} loading={loading} user={user} fetchUsers={fetchUsers} governorates={governorates} municipalities={municipalities} />} />
              <Route path="/permissions/:type" element={<PermissionsManagement user={user} users={users} fetchUsers={fetchUsers} governorates={governorates} municipalities={municipalities} services={services} />} />
            </Routes>
          </div>
        )}
      </AnimatePresence>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={true} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="light" 
      />
    </div>
  );
};

export default App;
