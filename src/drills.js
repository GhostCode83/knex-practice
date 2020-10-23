require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
})

function nameSearch(searchTerm) {
  knexInstance
    .select('name')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result)
    })
}

const text = 'fish'
//nameSearch(text)

function paginateItems(pageNumber) {
  const itemsPerPage = 6
  const offset = itemsPerPage * (pageNumber - 1)
  knexInstance
    .select('name')
    .from('shopping_list')
    .limit(itemsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result)
    })
}

//paginateItems(2)

function itemsAdded_DaysAgo(daysAgo) {

  knexInstance
    .select('name', 'price')
    .from('shopping_list')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days':: INTERVAL`, daysAgo)
    )
    .then(result => {
      console.log('Results from ', daysAgo, ' or less days ago: ', result)
    })
}

//itemsAdded_DaysAgo(10)

function totalCostOfEachCategory() {
  knexInstance
    .select('category')
    .sum('price as total')
    .from('shopping_list')
    .groupBy('category')
    .then(result => {
      console.log(result)
    })

}

//totalCostOfEachCategory()

function showArticles() {
  knexInstance
    .select('id', 'title', 'content', 'date_published')
    .from('blogful_articles')
    .then(result => {
      console.log(result)
    })
}

showArticles()

