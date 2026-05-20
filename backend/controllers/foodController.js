const axios = require('axios');
const FoodLog = require('../models/FoodLog');

const getHistory = async (req, res, next) => {
  try {
    const history = await FoodLog.find({ user: req.user.id }).sort({ dateLogged: -1 });
    res.json(history);
  } catch (error) {
    next(error);
  }
};

const logFood = async (req, res, next) => {
  try {
    const { name, calories, protein, fats, carbohydrates, sugar, servingSize, barcode, category } = req.body;
    const newLog = await FoodLog.create({
      user: req.user.id,
      name, calories, protein, fats, carbohydrates, sugar, servingSize, barcode, category
    });
    res.status(201).json(newLog);
  } catch (error) {
    next(error);
  }
};

const searchFood = async (req, res, next) => {
  const { barcode, query } = req.query;
  try {
    if (barcode) {
      const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
      const response = await axios.get(url);
      
      if (response.data && response.data.status === 1) {
        const product = response.data.product;
        const nutrients = product.nutriments || {};
        
        res.json({
          name: product.product_name || 'Unknown Product',
          calories: Math.round(nutrients['energy-kcal_100g'] || nutrients['energy-kcal'] || 0),
          protein: Math.round(nutrients['proteins_100g'] || nutrients['proteins'] || 0),
          fats: Math.round(nutrients['fat_100g'] || nutrients['fat'] || 0),
          carbohydrates: Math.round(nutrients['carbohydrates_100g'] || nutrients['carbohydrates'] || 0),
          sugar: Math.round(nutrients['sugars_100g'] || nutrients['sugars'] || 0),
          servingSize: product.serving_size || '100g',
          barcode: barcode
        });
      } else {
        res.status(404);
        throw new Error('Product not found');
      }
    } else if (query) {
      res.json({
        name: query,
        calories: Math.floor(Math.random() * 500) + 100,
        protein: Math.floor(Math.random() * 30) + 5,
        fats: Math.floor(Math.random() * 20) + 2,
        carbohydrates: Math.floor(Math.random() * 40) + 5,
        sugar: Math.floor(Math.random() * 15) + 1,
        servingSize: '1 serving'
      });
    } else {
      res.status(400);
      throw new Error('Provide barcode or query');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getHistory, logFood, searchFood };
