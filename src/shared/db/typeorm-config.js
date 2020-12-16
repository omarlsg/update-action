const typeorm = require('typeorm')
const EntitySchema = typeorm.EntitySchema

const ActionEntity = require('./typeorm-entity/Action')
const TransferEntity = require('./typeorm-entity/transfer')

const { MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_HOST } = process.env

const connectionConfig = {
  type: 'mysql',
  username: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  host: MYSQL_HOST,
  synchronize: false,
  extra: { connectionLimit: 10 },
  entities: [new EntitySchema(ActionEntity), new EntitySchema(TransferEntity)]
}

module.exports = connectionConfig
