import { DataStore } from '../config/db.js';

const CATEGORIES = ['Breakfast', 'Vegan', 'Desserts', 'Dinner', 'Quick Meals'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export class Recipe {
  static CATEGORIES = CATEGORIES;
  static DIFFICULTIES = DIFFICULTIES;

  static create(payload, author) {
    const rating = typeof payload.rating === 'number' && payload.rating > 0 ? payload.rating : 0;
    return DataStore.insert('recipes', {
      id: DataStore.nextId('recipes'),
      title: payload.title.trim(),
      description: (payload.description || '').trim(),
      ingredients: (payload.ingredients || []).map((i) => String(i).trim()).filter(Boolean),
      instructions: (payload.instructions || []).map((i) => String(i).trim()).filter(Boolean),
      category: payload.category,
      cookingTime: Number(payload.cookingTime) || 0,
      difficulty: payload.difficulty || 'Easy',
      image: payload.image || '',
      imageAlt: payload.imageAlt || payload.title,
      rating: rating,
      ratingCount: rating > 0 ? 1 : 0,
      authorId: author ? author.id : null,
      authorName: author ? author.name : 'Community',
      createdAt: new Date().toISOString(),
    });
  }

  static find(query = {}) {
    const rows = DataStore.find('recipes', () => true);
    let list = rows.slice();

    if (query.search) {
      const q = String(query.search).toLowerCase();
      const terms = q.split(/\s+/).filter(Boolean);
      list = list.filter((r) => {
        const hay = [
          r.title,
          r.description,
          r.category,
          ...(r.ingredients || []),
        ]
          .join(' ')
          .toLowerCase();
        return terms.every((t) => hay.includes(t));
      });
    }

    if (query.category && query.category !== 'All') {
      list = list.filter((r) => r.category === query.category);
    }

    if (query.difficulty && query.difficulty !== 'Any') {
      list = list.filter((r) => r.difficulty === query.difficulty);
    }

    if (query.maxTime && Number(query.maxTime) > 0) {
      list = list.filter((r) => r.cookingTime <= Number(query.maxTime));
    }

    const sort = query.sort || 'newest';
    list = list.sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'time') return a.cookingTime - b.cookingTime;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return list;
  }

  static findById(id) {
    return DataStore.findOne('recipes', (r) => Number(r.id) === Number(id)) || null;
  }

  static update(id, changes) {
    return DataStore.update('recipes', (r) => Number(r.id) === Number(id), changes);
  }

  static remove(id) {
    return DataStore.remove('recipes', (r) => Number(r.id) === Number(id));
  }

  static toPublic(row) {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      ingredients: row.ingredients,
      instructions: row.instructions,
      category: row.category,
      cookingTime: row.cookingTime,
      difficulty: row.difficulty,
      image: row.image,
      imageAlt: row.imageAlt,
      rating: row.rating,
      ratingCount: row.ratingCount,
      authorId: row.authorId,
      authorName: row.authorName,
      createdAt: row.createdAt,
    };
  }
}