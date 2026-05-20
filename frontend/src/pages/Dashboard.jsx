import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { toast } from 'react-toastify';
import { Clock } from 'lucide-react';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/food/history');
      setHistory(res.data);
    } catch (err) {
      toast.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  // Calculate today's totals
  const today = new Date().setHours(0, 0, 0, 0);
  const todaysLog = history.filter(item => new Date(item.dateLogged).setHours(0, 0, 0, 0) === today);

  const totals = todaysLog.reduce((acc, curr) => {
    acc.calories += curr.calories;
    acc.protein += curr.protein;
    acc.carbs += curr.carbohydrates || 0;
    acc.fats += curr.fats;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const macroData = [
    { name: 'Protein', value: totals.protein, color: '#3b82f6' },
    { name: 'Carbs', value: totals.carbs, color: '#8b5cf6' },
    { name: 'Fats', value: totals.fats, color: '#ef4444' }
  ].filter(item => item.value > 0);

  if (loading) {
    return <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-1">Hello, {user?.name?.split(' ')[0] || 'User'}</h1>
          <p className="text-slate-500 dark:text-slate-400">Here's your daily summary.</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-extrabold text-primary">{totals.calories}</div>
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Kcal Today</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel flex flex-col items-center justify-center min-h-[300px]">
          <h2 className="text-lg font-semibold w-full text-left mb-4">Macronutrients</h2>
          {macroData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: '8px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-slate-400 flex flex-col items-center gap-2">
              <PieChart size={48} className="opacity-50" />
              <p>No meals logged today</p>
            </div>
          )}
        </div>

        <div className="glass-panel">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Clock size={20} className="text-primary" /> Today's Log
          </h2>
          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {todaysLog.length > 0 ? todaysLog.map((log) => (
              <div key={log._id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <div>
                  <div className="font-semibold">{log.name}</div>
                  <div className="text-xs text-slate-500 mt-1 flex gap-2">
                    <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">{log.category}</span>
                    <span>{new Date(log.dateLogged).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{log.calories} kcal</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {log.protein}g P • {log.carbohydrates || 0}g C • {log.fats}g F
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-500 py-8">Log a meal to see it here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
