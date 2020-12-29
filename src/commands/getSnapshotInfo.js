const fs = require('fs')
const util = require('util')
const parse = require('csv-parse/lib/sync')

const fastcsv = require('fast-csv');

const {BigQuery} = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

const processFile = async ({ file, output}) => {
    const fileContent = await getFileContent(file)

    let changes_to_bq=fileContent.map(row => {
        const signer = row.source || row.target
         return `\n     SELECT 
                '`+row.transferId+`' AS transferId,
                '`+row.actionId+`' AS actionId,
                '`+signer+`' AS signer`
        })
    changes_to_bq=changes_to_bq.join('\n    UNION ALL\n')    

    const query = `WITH
    changes AS (
    `+changes_to_bq+`
    )
    ,wallet_staging AS (
      SELECT
        signer AS key
        ,wal.signer
        ,STRUCT (labels.type
                ,labels.created
                ,labels.channelSms) AS labels
        ,handle
      FROM
        \`minka-ach-dw.ach_tin.wallet\` AS wal,UNNEST(signer) AS signer
    )
    SELECT
      transferId
      ,actionId
      ,TO_JSON_STRING(STRUCT (
              STRUCT (
                sig.handle,
                sig.labels
              ) AS signer,
               STRUCT (
                  wal.handle,
                  wal.labels,
                  wal.signer
               ) AS wallet
             ))  AS signer_
    FROM
      changes AS cha
    LEFT JOIN
      wallet_staging AS wal ON wal.key=cha.signer
    LEFT JOIN
      \`minka-ach-dw.ach_tin.signer\` AS sig ON sig.handle=cha.signer`;

    
    const results = await queryBigquery(query)

    const ws = fs.createWriteStream(output);
    fastcsv
        .write(results, { headers: true })
        .pipe(ws);
    console.log('Info retrieved succesfully')
  }

const getFileContent = async filePath => {
    const readFile = util.promisify(fs.readFile)
    const fileContent = await readFile(filePath, { encoding: 'utf8' })
    const csvParsed = parse(fileContent, {
      columns: true
    })
    return csvParsed
  }

const queryBigquery = async (query) => {

    const options = {
      query: query,
      location: 'US',
    };
  
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();
  
    return rows;
  }

module.exports = processFile