import { Recipe } from '../models/recipe.js';

export const recipeController = {
  list(req, res) {
    const recipes = Recipe.find(req.query).map(Recipe.toPublic);
    return res.json({
      count: recipes.length,
      recipes,
    });
  },

  getById(req, res) {
    const recipe = Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }
    return res.json({ recipe: Recipe.toPublic(recipe) });
  },

  create(req, res) {
    const recipe = Recipe.create(req.body, req.user);
    return res.status(201).json({ message: 'Recipe published successfully.', recipe: Recipe.toPublic(recipe) });
  },

  update(req, res) {
    const existing = Recipe.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }
    if (existing.authorId !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own recipes.' });
    }
    const recipe = Recipe.update(existing.id, {
      title: (req.body.title || existing.title).trim(),
      description: req.body.description !== undefined ? (req.body.description || '').trim() : existing.description,
      ingredients: req.body.ingredients !== undefined ? req.body.ingredients.map((i) => String(i).trim()).filter(Boolean) : existing.ingredients,
      instructions: req.body.instructions !== undefined ? req.body.instructions.map((i) => String(i).trim()).filter(Boolean) : existing.instructions,
      category: req.body.category || existing.category,
      cookingTime: req.body.cookingTime !== undefined ? Number(req.body.cookingTime) || existing.cookingTime : existing.cookingTime,
      difficulty: req.body.difficulty || existing.difficulty,
      image: req.body.image !== undefined ? req.body.image : existing.image,
    });
    return res.json({ message: 'Recipe updated successfully.', recipe: Recipe.toPublic(recipe) });
  },

  remove(req, res) {
    const existing = Recipe.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }
    if (existing.authorId !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own recipes.' });
    }
    Recipe.remove(existing.id);
    return res.json({ message: 'Recipe deleted successfully.' });
  },

  rate(req, res) {
    const recipe = Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }
    const value = Number(req.body.rating);
    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }
    const n = recipe.ratingCount || 0;
    const updated = Recipe.update(recipe.id, {
      rating: Number(((recipe.rating || 0) * n + value) / (n + 1)).toFixed(1),
      ratingCount: n + 1,
    });
    return res.json({ message: 'Thanks for rating!', recipe: Recipe.toPublic(updated) });
  },

  categories(_req, res) {
    return res.json({ categories: Recipe.CATEGORIES });
  },
};