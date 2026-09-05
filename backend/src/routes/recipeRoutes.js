import { Router } from 'express';
import { recipeController } from '../controllers/recipeController.js';
import { authRequired } from '../middleware/auth.js';
import { validateRecipe, normalizeIngredientsAndInstructions } from '../middleware/validate.js';

const router = Router();

router.get('/', recipeController.list);
router.get('/categories', recipeController.categories);
router.get('/:id', recipeController.getById);

router.post('/', authRequired, normalizeIngredientsAndInstructions, validateRecipe, recipeController.create);
router.put('/:id', authRequired, normalizeIngredientsAndInstructions, recipeController.update);
router.delete('/:id', authRequired, recipeController.remove);
router.post('/:id/rate', authRequired, recipeController.rate);

export default router;