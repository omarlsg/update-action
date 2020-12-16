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
    ({ transferId,actionId, ...newSnapshot }) => {
      newSnapshot.target=JSON.parse(newSnapshot.target)

      //delete bigquery garbage 
      delete newSnapshot.target.signer.labels.__key__;

      switch (to_do){
        case "update":
          updateTransfer(transferId,newSnapshot)
          return updateAction(actionId, newSnapshot)
        case "check":
          return readAction(actionId)
        default:
          console.log("Invalid -td command");
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

const updateAction = async (actionId, newSnapshot) => {
  try {
    const action = await getAction(actionId)
    await executeActionUpdateOnMysql(action, newSnapshot)
    await executeActionUpdateOnDs(action, newSnapshot)
    console.log(`Update both actions successfully: ${actionId}`)
  } catch (error) {
    console.log(`Update action error: ${error.message} actionId: ${actionId}`)
    console.log(error)
  }
}

const updateTransfer = async (transferId, newSnapshot) => {
  try {
    const repository = await getRepository('Transfer')
    const transfer=  await repository.findOne({ transferId: transferId })

    await executeTransferUpdateOnMysql(transfer, newSnapshot)
    console.log(`Update transfer successfully: ${transferId}`)
  } catch (error) {
    console.log(`Update transfer error: ${error.message} transferId: ${transferId}`)
    console.log(error)
  }
}


const readAction = async (actionId) => {
  try {
    const repository = await getRepository('Action')

    const ds_action = await getAction(actionId)
    const sql_action=  await repository.findOne({ action_id: actionId })

    var msg_ds = ""
    var msg_sql = ""
    
    msg_ds+= (ds_action?ds_action.snapshot.target.signer.handle:ds_action) + "\t"
    msg_sql+= (sql_action?sql_action.snapshot.target.signer.handle:sql_action) + "\t"

    console.log(`${actionId}  ${msg_ds}||\t${msg_sql}`)
  } catch (error) {
    console.log(error)
  }
}

const executeActionUpdateOnMysql = async (action, newSnapshot) => {
  const actionId = action.action_id
  const repository = await getRepository('Action')
  const entity = { snapshot: { ...action.snapshot, ...newSnapshot } }
  
  if(newSnapshot.target){
    entity.targetBankBicfi=newSnapshot.target.signer.labels.bankBicfi
    entity.targetBank=newSnapshot.target.signer.labels.bankName
    entity.targetSigner=newSnapshot.target.signer.handle
    entity.targetWallet=newSnapshot.target.wallet.handle
    entity.target=newSnapshot.target.wallet.handle || newSnapshot.target.signer.handle
  }

  await repository
    .createQueryBuilder()
    .update()
    .set(entity)
    .where('action_id = :actionId', { actionId })
    .execute()
}

const executeTransferUpdateOnMysql = async (transfer, newSnapshot) => {
  const transferId = transfer.transferId
  const repository = await getRepository('Transfer')
  const entity = { snapshot: { ...transfer.snapshot, ...newSnapshot } }
  
  if(newSnapshot.target){
    entity.targetBankBicfi=newSnapshot.target.signer.labels.bankBicfi
    entity.targetBank=newSnapshot.target.signer.labels.bankName
    entity.targetSigner=newSnapshot.target.signer.handle
    entity.targetWallet=newSnapshot.target.wallet.handle
    entity.target=newSnapshot.target.wallet.handle || newSnapshot.target.signer.handle
  }

  await repository
    .createQueryBuilder()
    .update()
    .set(entity)
    .where('transferId = :transferId', { transferId })
    .execute()
}

const executeActionUpdateOnDs = async (action, newSnapshot) => {
  const key = action[DatastoreDb.KEY]
  const entity = {
    key,
    data: {
      ...action,
      target:newSnapshot.target.wallet.handle,
      snapshot: {
        ...action.snapshot,
        ...newSnapshot
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
