const mongoose = require('mongoose');

const foodLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  fats: { type: Number, required: true },
  carbohydrates: { type: Number, default: 0 },
  sugar: { type: Number, default: 0 },
  servingSize: { type: String, default: '100g' },
  barcode: { type: String, default: null },
  category: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], default: 'Snack' },
  dateLogged: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FoodLog', foodLogSchema);
