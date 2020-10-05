const fs = require('fs')
const util = require('util')
const csv = require('csv/lib/sync')
const { map } = require('bluebird')
const { getRepository } = require('typeorm')

const { DatastoreDb, MysqlDb } = require('../shared/db')

const CONCURRENCY = 5

const processFile = async ({ file,to_do }) => {
  await executeDBConnection()
  const fileContent = getFileContent(file)

  map(
    fileContent,
    ({ actionId, hash }) => {
      return (to_do == "update"?updateAction(actionId, hash):readAction(actionId))
    },
    { concurrency: CONCURRENCY }
  )
}

const executeDBConnection = async () => {
  try {
    const ds = DatastoreDb
    const ms = await MysqlDb

    console.log('Connect DBs successfully')
    return { ds, ms }
  } catch (error) {
    console.error(`Error connecting db ${error.message}`)
    process.exit(1)
  }
}

const getFileContent = async filePath => {
  const readFile = util.promisify(fs.readFile)
  const fileContent = await readFile(filePath, { encoding: 'utf8' })
  const csvParsed = csv.parse(fileContent, {
    columns: true
  })
  return csvParsed
}

const updateAction = async (actionId, hash) => {
  try {
    const action = await getAction(actionId)
    
    await executeActionUpdateOnMysql(action, hash)
    await executeActionUpdateOnDs(action, hash)
    console.log(`Update both actions successfully: ${actionId}`)
  } catch (error) {
    console.log(error)
  }
}


const readAction = async (actionId) => {
  try {
    const repository = await getRepository('Action')

    const ds_action = await getAction(actionId)
    const sql_action=  await repository.findOne({ action_id: actionId });

    console.log(`${actionId}  ${ds_action.labels.hash}  ${sql_action.labels.hash}`)
  } catch (error) {
    console.log(error)
  }
}

const executeActionUpdateOnMysql = async (action, hash) => {
  const actionId = action.action_id
  const repository = await getRepository('Action')
  await repository
    .createQueryBuilder()
    .update()
    .set({ labels: { ...action.labels, hash } })
    .where('action_id = :actionId', { actionId })
    .execute()
}

const executeActionUpdateOnDs = async (action, hash) => {
  const key = action[DatastoreDb.KEY]
  const entity = {
    key,
    data: {
      ...action,
      labels: {
        ...action.labels,
        hash
      }
    }
  }
  await DatastoreDb.update(entity)
}

const getAction = async actionId => {
  const key = DatastoreDb.key(['Action', actionId])
  const [action] = await DatastoreDb.get(key)
  return action  
}

module.exports = processFile
