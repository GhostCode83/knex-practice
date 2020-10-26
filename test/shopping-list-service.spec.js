const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')
const { expect } = require('chai')

describe(`Shopping list service object`, function () {
  //name, price, category, checked, date_added
  let db
  let testListItems = [
    {
      id: 1,
      name: 'First test item.',
      price: "1.11",
      category: 'Breakfast',
      checked: true,
      date_added: new Date('2029-02-23T18:28:32.617Z')
    },
    {
      id: 2,
      name: 'Second test item.',
      price: "2.22",
      category: 'Lunch',
      checked: true,
      date_added: new Date('1919-12-22T16:28:32.615Z')
    },
    {
      id: 3,
      name: 'Third test item.',
      price: "3.33",
      category: 'Main',
      checked: false,
      date_added: new Date('2100-05-22T16:28:32.615Z')
    }
  ]

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.DB_URL,
    })
  })

  before(() => db('shopping_list').truncate())

  afterEach(() => db('shopping_list').truncate())

  after(() => db.destroy())

  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testListItems)
    })

    it(`getAllShoppingListItems() resolves all items from 'shopping_list' table`, () => {
      return ShoppingListService.getAllShoppingListItems(db)
        .then(actual => {
          expect(actual).to.eql(testListItems)
        })
    })

    it(`getById() resolves a list item by id from 'shopping_list' table`, () => {
      const thirdId = 3
      const thirdTestItem = testListItems[thirdId - 1]
      return ShoppingListService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdId,
            name: thirdTestItem.name,
            price: thirdTestItem.price,
            category: thirdTestItem.category,
            checked: thirdTestItem.checked,
            date_added: thirdTestItem.date_added,
          })
        })
    })

    it(`deleteShoppingListItem() removes an item by id from 'shopping_list' table`, () => {
      const itemId = 3
      return ShoppingListService.deleteShoppingListItem(db, itemId)
        .then(() => ShoppingListService.getAllShoppingListItems(db))
        .then(allShopppingListItems => {
          const expected = testListItems.filter(item => item.id !== itemId)
          expect(allShopppingListItems).to.eql(expected)
        })
    })

    it(`updateShoppingListItem() updates an item from 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3
      const newItemData = {
        name: 'update name',
        price: '0.01',
        category: 'Main',
        checked: true,
        date_added: new Date(),
      }
      return ShoppingListService.updateShoppingListItem(db, idOfItemToUpdate, newItemData)
        .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...newItemData
          })
        })
    })
  })

  context(`Given 'shopping_list' has no data`, () => {
    it(`getAllShoppingListItems() resolves an empty array`, () => {
      return ShoppingListService.getAllShoppingListItems(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
    })

    it(`insertShoppingListItem() inserts a new shopping list item and resolves the new item with an id`, () => {
      const newShoppingListItem = {
        name: 'New test item.',
        price: "0.00",
        category: 'Snack',
        checked: true,
        date_added: new Date('2100-05-22T16:28:32.615Z')
      }
      return ShoppingListService.insertShoppingListItem(db, newShoppingListItem)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            name: newShoppingListItem.name,
            price: newShoppingListItem.price,
            category: newShoppingListItem.category,
            checked: newShoppingListItem.checked,
            date_added: newShoppingListItem.date_added,
          })
        })
    })
  })
})