const { createConnection } = require('typeorm')
const typeormConfig = require('./typeorm-config')

const connection = createConnection(typeormConfig)

module.exports = connection
