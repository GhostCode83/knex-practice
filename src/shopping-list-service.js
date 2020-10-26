const ShoppingListService = {
  getAllShoppingListItems(knex) {
    return knex.select('*').from('shopping_list')
  },
  insertShoppingListItem(knex, newShoppingListItem) {
    return knex
      .insert(newShoppingListItem)
      .into('shopping_list')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex.from('shopping_list').select('*').where('id', id).first()
  },
  deleteShoppingListItem(knex, id) {
    return knex('shopping_list')
      .where({ id })
      .delete()
  },
  updateShoppingListItem(knex, id, newShoppingListFields) {
    return knex('shopping_list')
      .where({ id })
      .update(newShoppingListFields)
  }
}

module.exports = ShoppingListService