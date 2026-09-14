/**
 * Model: CategoryModel
 * Represents the `categories` table in database `u278523899_findit`
 */
export class CategoryModel {
  constructor({
    id = null,
    name = '',
    created_at = null,
    updated_at = null
  } = {}) {
    this.id = id;
    this.name = name;
    this.created_at = created_at || new Date().toISOString();
    this.updated_at = updated_at || new Date().toISOString();
  }
}

export default CategoryModel;
