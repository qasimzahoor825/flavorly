import { Recipe } from '../models/recipe.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister(req, res, next) {
  const { name, email, password } = req.body || {};
  const errors = {};
  if (!name || !String(name).trim()) errors.name = 'Name is required';
  if (!email || !EMAIL_RE.test(String(email).trim())) errors.email = 'A valid email is required';
  if (!password || String(password).length < 6) errors.password = 'Password must be at least 6 characters';
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body || {};
  const errors = {};
  if (!email) errors.email = 'Email is required';
  if (!password) errors.password = 'Password is required';
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  next();
}

export function validateRecipe(req, res, next) {
  const r = req.body || {};
  const errors = {};

  if (!r.title || !String(r.title).trim()) errors.title = 'Recipe title is required';
  else if (String(r.title).trim().length < 3) errors.title = 'Title must be at least 3 characters';

  if (!Array.isArray(r.ingredients) || r.ingredients.filter((i) => String(i).trim()).length === 0) {
    errors.ingredients = 'At least one ingredient is required';
  }

  if (!Array.isArray(r.instructions) || r.instructions.filter((i) => String(i).trim()).length === 0) {
    errors.instructions = 'At least one instruction step is required';
  }

  if (!r.category || !Recipe.CATEGORIES.includes(r.category)) {
    errors.category = `Category must be one of: ${Recipe.CATEGORIES.join(', ')}`;
  }

  if (!r.cookingTime || Number(r.cookingTime) <= 0) {
    errors.cookingTime = 'Cooking time must be a positive number (minutes)';
  }

  if (r.difficulty && !Recipe.DIFFICULTIES.includes(r.difficulty)) {
    errors.difficulty = `Difficulty must be one of: ${Recipe.DIFFICULTIES.join(', ')}`;
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({ message: 'Recipe validation failed', errors });
  }
  next();
}

export function normalizeIngredientsAndInstructions(req, _res, next) {
  const r = req.body || {};
  const split = (v) => (Array.isArray(v) ? v : String(v || '').split('\n'));
  r.ingredients = split(r.ingredients).map((i) => String(i).trim()).filter(Boolean);
  r.instructions = split(r.instructions).map((i) => String(i).trim()).filter(Boolean);
  next();
}