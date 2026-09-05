import { DataStore } from '../config/db.js';

export class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.passwordHash = data.passwordHash;
    this.createdAt = data.createdAt;
  }

  static create({ name, email, passwordHash }) {
    return DataStore.insert('users', {
      id: DataStore.nextId('users'),
      name,
      email: String(email).trim().toLowerCase(),
      passwordHash,
      createdAt: new Date().toISOString(),
    });
  }

  static findByEmail(email) {
    return DataStore.findOne('users', (u) => u.email === String(email).trim().toLowerCase()) || null;
  }

  static findById(id) {
    return DataStore.findOne('users', (u) => Number(u.id) === Number(id)) || null;
  }

  toPublic() {
    return User.toPublic(this);
  }

  static toPublic(row) {
    return { id: row.id, name: row.name, email: row.email, createdAt: row.createdAt };
  }
}