import React from "react";
import { User } from "../types";
import UserList from "./users/UserList";
import AddUserForm from "./users/AddUserForm";

interface UsersManagementProps {
  users: User[];
  authForm: any;
  setAuthForm: (form: any) => void;
  handleAdminCreateUser: (e: React.FormEvent) => void;
  loading: boolean;
  user?: User | null;
  fetchUsers?: (token: string) => void;
  governorates: any[];
  municipalities: any[];
}

const UsersManagement: React.FC<UsersManagementProps> = ({
  users,
  authForm,
  setAuthForm,
  handleAdminCreateUser,
  loading,
  user,
  fetchUsers,
  governorates,
  municipalities
}) => {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12 text-right" dir="rtl">
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-800 mb-4">إدارة المستخدمين</h2>
          <p className="text-gray-500">إضافة وإدارة صلاحيات الموظفين والمسؤولين</p>
        </div>

        <AddUserForm
          authForm={authForm}
          setAuthForm={setAuthForm}
          handleAdminCreateUser={handleAdminCreateUser}
          loading={loading}
          governorates={governorates}
          municipalities={municipalities}
        />

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800">قائمة المستخدمين المسجلين</h3>
          <UserList users={users} currentUser={user} fetchUsers={fetchUsers} />
        </div>
      </div>
    </main>
  );
};

export default UsersManagement;
