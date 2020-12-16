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
    ({ actionId, ...newLabels }) => {
      switch (to_do){
        case "update":
          return updateAction(actionId, newLabels)
        case "check":
          return readAction(actionId, newLabels)
        default:
          console.log("Invalid td command");
          return null
      }
    },
    { concurrency: CONCURRENCY }
  )
}

const executeDBConnection = async () => {
  try {
    const ds = DatastoreDb
    console.log('Connect Datastore successfully')
    const ms = await MysqlDb
    console.log('Connect mySQL successfully')

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

const updateAction = async (actionId, labels) => {
  try {
    const action = await getAction(actionId)
    
    await executeActionUpdateOnMysql(action, labels)
    await executeActionUpdateOnDs(action, labels)
    console.log(`Update both actions successfully: ${actionId}`)
  } catch (error) {
    console.log(`Update action error: ${error.message} actionId: ${actionId}`)
    console.log(error)
  }
}


const readAction = async (actionId, labels) => {
  try {
    const repository = await getRepository('Action')

    const fields = Object.keys(labels)

    const ds_action = await getAction(actionId)
    const sql_action=  await repository.findOne({ action_id: actionId })

    var msg_ds = ""
    var msg_sql = ""
    for (index = 0; index < fields.length; index++) { 
      msg_ds+= (ds_action?ds_action.labels[fields[index]]:ds_action) + "\t"
      msg_sql+= (sql_action?sql_action.labels[fields[index]]:sql_action) + "\t"
    }

    console.log(`${actionId}  ${msg_ds}||\t${msg_sql}`)
  } catch (error) {
    console.log(error)
  }
}

const executeActionUpdateOnMysql = async (action, newLabels) => {
  const actionId = action.action_id
  const repository = await getRepository('Action')
  const entity = { labels: { ...action.labels, ...newLabels } }
  
  if(newLabels.tx_ref){
    entity.transferId=newLabels.tx_ref
  }

  if (entity.labels.reverseInitiated) 
    entity.labels.reverseInitiated = entity.labels.reverseInitiated === 'true' ? true : false
  await repository
    .createQueryBuilder()
    .update()
    .set(entity)
    .where('action_id = :actionId', { actionId })
    .execute()
}

const executeActionUpdateOnDs = async (action, newLabels) => {
  const key = action[DatastoreDb.KEY]
  const entity = {
    key,
    data: {
      ...action,
      labels: {
        ...action.labels,
        ...newLabels
      }
    }
  }
  if (entity.data.labels.reverseInitiated) entity.data.labels.reverseInitiated = entity.data.labels.reverseInitiated === 'true' ? true : false
  await DatastoreDb.update(entity)
}

const getAction = async actionId => {
  const key = DatastoreDb.key(['Action', actionId])
  const [action] = await DatastoreDb.get(key)
  return action  
}

module.exports = processFile
