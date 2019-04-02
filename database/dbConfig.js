const knex = require('knex')
const knexCongif = require('../knexfile')

module.exports = knex(knexCongif.development)