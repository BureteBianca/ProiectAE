const express = require('express');
const { Favorite, Product } = require('../database/models');
const { verifyToken } = require('../utils/token.js');

const router = express.Router();

/**
 * ✅ Adaugă un produs la favorite
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId; // vine din token

    // Verifică dacă produsul există
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Verifică dacă este deja la favorite
    const existing = await Favorite.findOne({ where: { userId, productId } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already in favorites' });
    }

    // Creează înregistrarea
    const favorite = await Favorite.create({ userId, productId });
    res.status(201).json({ success: true, message: 'Added to favorites', data: favorite });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding to favorites', data: error.message });
  }
});

/**
 * ✅ Obține toate favoritele unui user
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [{ model: Product }]
    });

    res.status(200).json({ success: true, message: 'Favorites retrieved', data: favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving favorites', data: error.message });
  }
});

/**
 * ❌ Șterge un produs din favorite
 */
router.delete('/:productId', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const productId = req.params.productId;

    const favorite = await Favorite.findOne({ where: { userId, productId } });
    if (!favorite) {
      return res.status(404).json({ success: false, message: 'Favorite not found' });
    }

    await favorite.destroy();
    res.status(200).json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing favorite', data: error.message });
  }
});

module.exports = router;
