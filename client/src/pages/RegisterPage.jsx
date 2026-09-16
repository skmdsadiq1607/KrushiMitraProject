import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, Lock, Mail, User, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("farmer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({ name, email, password, role });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-[85vh] flex items-center justify-center px-4 py-12"><div className="w-full max-w-md space-y-6">{
    /* Header */
  }<div className="text-center space-y-2"><div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/30"><Sprout className="w-7 h-7" /></div><h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Create Free Account
          </h1><p className="text-xs text-slate-500 dark:text-slate-400">
            Join KrushiMitra to diagnose plants, track field logs, and receive advisories.
          </p></div>{
    /* Form Box */
  }<div className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">{error && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>}<form onSubmit={handleSubmit} className="space-y-4"><div className="space-y-1"><label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Full Name
              </label><div className="relative"><User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><input
    type="text"
    required
    placeholder="e.g. Ramesh Patel"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
  /></div></div><div className="space-y-1"><label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label><div className="relative"><Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><input
    type="email"
    required
    placeholder="name@example.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
  /></div></div><div className="space-y-1"><label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Password
              </label><div className="relative"><Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><input
    type="password"
    required
    minLength={6}
    placeholder="At least 6 characters"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
  /></div></div><div className="space-y-1"><label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Agricultural Role
              </label><select
    value={role}
    onChange={(e) => setRole(e.target.value)}
    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
  ><option value="farmer">Farmer / Cultivator</option><option value="agronomist">Agronomist / Field Officer</option><option value="student">Agriculture / IT Student</option><option value="researcher">Scientific Researcher</option></select></div><button
    type="submit"
    disabled={loading}
    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
  >{loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}</button></form><div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Already have an account?{" "}<Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
              Sign in
            </Link></div></div></div></div>;
};
export {
  RegisterPage
};
