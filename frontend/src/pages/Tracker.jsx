import React, { useState, useRef } from 'react';
import axios from 'axios';
import { ScanLine, Search, CheckCircle2, ImagePlus } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Tracker = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentFood, setCurrentFood] = useState(null);
  const [category, setCategory] = useState('Snack');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSearchByQuery = async (queryToSearch) => {
    if (!queryToSearch.trim()) return;
    
    setLoading(true);
    setCurrentFood(null);
    
    try {
      const isBarcode = /^\d+$/.test(queryToSearch) && queryToSearch.length >= 8;
      const endpoint = isBarcode 
        ? `http://localhost:5000/api/food/search?barcode=${queryToSearch}`
        : `http://localhost:5000/api/food/search?query=${queryToSearch}`;
        
      const res = await axios.get(endpoint);
      setCurrentFood(res.data);
    } catch (err) {
      toast.error('Food not found. Try another meal or barcode.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const reader = new BrowserMultiFormatReader();
      const imageUrl = URL.createObjectURL(file);
      const result = await reader.decodeFromImageUrl(imageUrl);
      
      if (result && result.text) {
        setInput(result.text);
        await handleSearchByQuery(result.text);
      } else {
        toast.error('Could not detect a barcode in the image.');
      }
      URL.revokeObjectURL(imageUrl);
    } catch (err) {
      toast.error('Failed to read barcode from image.');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleLogFood = async () => {
    if (!currentFood) return;
    
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/food/log', { ...currentFood, category });
      toast.success('Meal logged successfully!');
      navigate('/');
    } catch (err) {
      toast.error('Failed to log food.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Track Food</h1>
        <p className="text-slate-500">Scan a barcode or search manually.</p>
      </div>

      <div className="glass-panel">
        <div className="relative flex items-center">
          <input
            type="text"
            className="input-field pr-24"
            placeholder="e.g. Avocado Toast or Barcode"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchByQuery(input)}
          />
          
          <div className="absolute right-2 flex gap-2">
            <button 
              className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-primary hover:text-white transition-colors"
              onClick={() => fileInputRef.current?.click()} 
              title="Upload Image"
            >
              <ImagePlus size={18} />
            </button>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload} 
            />
            <button 
              className="p-2 bg-primary text-white rounded-lg hover:bg-primaryHover transition-colors shadow-lg shadow-primary/30"
              onClick={() => handleSearchByQuery(input)} 
            >
              {/^\d+$/.test(input) && input.length >= 8 ? <ScanLine size={18} /> : <Search size={18} />}
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {currentFood && !loading && (
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-6">{currentFood.name}</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-700">
                <div className="text-2xl font-bold text-amber-500">{currentFood.calories}</div>
                <div className="text-xs uppercase font-medium text-slate-500 mt-1">Kcal</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-700">
                <div className="text-2xl font-bold text-blue-500">{currentFood.protein}g</div>
                <div className="text-xs uppercase font-medium text-slate-500 mt-1">Protein</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-700">
                <div className="text-2xl font-bold text-purple-500">{currentFood.carbohydrates || 0}g</div>
                <div className="text-xs uppercase font-medium text-slate-500 mt-1">Carbs</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-700">
                <div className="text-2xl font-bold text-red-500">{currentFood.fats}g</div>
                <div className="text-xs uppercase font-medium text-slate-500 mt-1">Fats</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <select 
                className="input-field sm:w-1/3"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snack</option>
              </select>
              
              <button className="btn-primary flex-1" onClick={handleLogFood}>
                <CheckCircle2 size={20} /> Log to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracker;
