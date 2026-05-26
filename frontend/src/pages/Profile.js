import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-sm text-slate-400 mt-1">Account details and role information</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-glass p-6 rounded-3xl">
          <div className="flex flex-col items-center text-center gap-4">
            <img
              className="w-28 h-28 rounded-full border-4 border-sky-500 shadow-xl"
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="profile"
            />
            <div>
              <h2 className="text-2xl font-semibold text-white">{user?.name || 'User Name'}</h2>
              <p className="text-sm text-slate-400">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 card-glass p-6 rounded-3xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-slate-950 p-5 rounded-3xl border border-white/5">
              <p className="text-sm text-slate-400 uppercase tracking-[0.2em]">Role</p>
              <p className="mt-3 text-xl font-semibold text-white">{user?.role || 'Student'}</p>
            </div>
            <div className="bg-slate-950 p-5 rounded-3xl border border-white/5">
              <p className="text-sm text-slate-400 uppercase tracking-[0.2em]">Department</p>
              <p className="mt-3 text-xl font-semibold text-white">{user?.department || 'N/A'}</p>
            </div>
            <div className="bg-slate-950 p-5 rounded-3xl border border-white/5">
              <p className="text-sm text-slate-400 uppercase tracking-[0.2em]">Batch</p>
              <p className="mt-3 text-xl font-semibold text-white">{user?.batch || 'N/A'}</p>
            </div>
            <div className="bg-slate-950 p-5 rounded-3xl border border-white/5">
              <p className="text-sm text-slate-400 uppercase tracking-[0.2em]">Status</p>
              <p className="mt-3 text-xl font-semibold text-emerald-400">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;