import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Info,
  DollarSign,
  Briefcase,
  User,
  TrendingUp,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const API_BASE = "http://localhost:8000"; // Update for production

const InputField = ({ label, name, type, value, onChange, icon: Icon, placeholder, tooltip }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-slate-400 text-sm">
      <Icon size={16} />
      <span>{label}</span>
      {tooltip && (
        <div className="group relative">
          <Info size={14} className="cursor-help" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 text-xs rounded shadow-lg border border-slate-700 z-50">
            {tooltip}
          </div>
        </div>
      )}
    </div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white"
    />
  </div>
);

const RiskFactor = ({ factor }) => {
  const isNegative = factor.impact === "Negative";
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-xl border ${isNegative ? 'bg-red-500/5 border-red-500/20' : 'bg-green-500/5 border-green-500/20'} flex gap-4`}
    >
      <div className={`mt-1 ${isNegative ? 'text-red-400' : 'text-green-400'}`}>
        {isNegative ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
      </div>
      <div>
        <h4 className={`font-semibold ${isNegative ? 'text-red-200' : 'text-green-200'}`}>{factor.factor}</h4>
        <p className="text-slate-400 text-sm leading-relaxed">{factor.description}</p>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [formData, setFormData] = useState({
    person_age: 30,
    person_income: 50000,
    person_home_ownership: 'RENT',
    person_emp_length: 5,
    loan_intent: 'PERSONAL',
    loan_grade: 'B',
    loan_amnt: 10000,
    loan_int_rate: 10.0,
    loan_percent_income: 0.2,
    cb_person_default_on_file: 'N',
    cb_person_cred_hist_length: 5
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE}/predict`, formData);
      setResult(response.data);
    } catch (err) {
      setError("Unable to connect to the risk engine. Please ensure the backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = result ? [
    { value: result.default_probability * 100 },
    { value: (1 - result.default_probability) * 100 }
  ] : [];

  const COLORS = result ? [
    result.risk_level === 'High' ? '#ef4444' : result.risk_level === 'Medium' ? '#f59e0b' : '#22c55e',
    '#1e293b'
  ] : [];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text tracking-tight">RiskLens-AI</h1>
            <p className="text-slate-400 text-lg">Industrial Grade Credit Risk Assessment</p>
          </div>
          <div className="px-4 py-2 glass-card flex items-center gap-2 text-primary font-medium">
            <ShieldCheck size={20} />
            <span>Secure Inference Engine</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Input Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <ShieldAlert className="text-primary" /> Application Data
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Age" name="person_age" type="number"
                    value={formData.person_age} onChange={handleInputChange} icon={User}
                    tooltip="Applicant's current age"
                  />
                  <InputField
                    label="Employment (Yrs)" name="person_emp_length" type="number"
                    value={formData.person_emp_length} onChange={handleInputChange} icon={Briefcase}
                    tooltip="Years at current job"
                  />
                </div>
                <InputField
                  label="Annual Income ($)" name="person_income" type="number"
                  value={formData.person_income} onChange={handleInputChange} icon={DollarSign}
                  tooltip="Total yearly gross income"
                />
                <InputField
                  label="Loan Amount ($)" name="loan_amnt" type="number"
                  value={formData.loan_amnt} onChange={handleInputChange} icon={TrendingUp}
                  tooltip="Total amount requested for the loan"
                />

                <div className="space-y-2">
                  <label className="text-slate-400 text-sm flex items-center gap-2">
                    <ShieldAlert size={16} /> Home Ownership
                  </label>
                  <select
                    name="person_home_ownership" value={formData.person_home_ownership}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                  >
                    <option value="RENT">Rent</option>
                    <option value="MORTGAGE">Mortgage</option>
                    <option value="OWN">Own</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 text-sm flex items-center gap-2">
                    <AlertTriangle size={16} /> Previous Default?
                  </label>
                  <select
                    name="cb_person_default_on_file" value={formData.cb_person_default_on_file}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                  >
                    <option value="N">No</option>
                    <option value="Y">Yes</option>
                  </select>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${loading ? 'bg-slate-700 cursor-not-allowed' : 'bg-primary hover:bg-blue-600 shadow-primary/20'
                    }`}
                  disabled={loading}
                >
                  {loading ? 'Analyzing Risk...' : 'Run Risk Assessment'}
                </motion.button>
              </form>
            </div>
          </div>

          {/* Results Dashboard */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {!result && !error ? (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="glass-card inset-0 h-full flex flex-col items-center justify-center p-12 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-6 border border-slate-800">
                    <TrendingUp className="text-slate-700" size={40} />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-300">Ready for Analysis</h3>
                  <p className="text-slate-500 max-w-sm mt-2">
                    Submit an application to generate real-time risk predictions and detailed explanations.
                  </p>
                </motion.div>
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="glass-card bg-red-500/5 border-red-500/20 p-8 text-center"
                >
                  <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
                  <h3 className="text-xl font-bold text-red-200">System Error</h3>
                  <p className="text-red-400/80 mt-2">{error}</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Score Card */}
                  <div className="glass-card p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="relative h-48 w-48 mx-auto">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%" cy="50%"
                            innerRadius={60} outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            startAngle={90} endAngle={450}
                          >
                            <Cell fill={COLORS[0]} />
                            <Cell fill={COLORS[1]} />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold">{(result.default_probability * 100).toFixed(1)}%</span>
                        <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Risk Score</span>
                      </div>
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Inference Result</h3>
                      <div className={`text-4xl font-bold mb-4 ${result.risk_level === 'High' ? 'text-red-500' :
                          result.risk_level === 'Medium' ? 'text-amber-500' : 'text-green-500'
                        }`}>
                        {result.risk_level} Risk
                      </div>
                      <p className="text-slate-400 leading-relaxed">
                        Our model has classified this application as <span className="text-white font-medium">{result.risk_level} Risk</span>.
                        Repayment probability is <span className="text-white font-medium">{(100 - result.default_probability * 100).toFixed(1)}%</span>.
                      </p>
                    </div>
                  </div>

                  {/* Explanations */}
                  <div className="glass-card p-8">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <Info className="text-primary" /> Key Risk Drivers
                    </h3>
                    <div className="grid gap-4">
                      {result.explanations && result.explanations.length > 0 ? (
                        result.explanations.map((ex, idx) => (
                          <RiskFactor key={idx} factor={ex} />
                        ))
                      ) : (
                        <p className="text-slate-500 italic">No specific risk drivers identified for this profile.</p>
                      )}
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-slate-500 text-sm flex justify-between">
        <p>© 2026 RiskLens Intelligence Platform</p>
        <p>Deployment: Render Cloud • Model: XGBoost v2.1.1</p>
      </footer>
    </div>
  );
}
