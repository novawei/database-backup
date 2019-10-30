const fs = require('fs')
const path = require('path')
const mysqldump = require('mysqldump')
const mongodump = require('mongodb-backup')
const del = require('del')

async function backupMySql(destDir, dbconf) {
  console.log('start backup mysql...')
  for (let dbName of dbconf.database) {
    console.log(`\tbackup ${dbName}`)
    const destPath = path.resolve(destDir, `${dbName}.sql.gz`)
    if (fs.existsSync(destPath)) {
      fs.unlinkSync(destPath)
    }
    await mysqldump({
      connection: {
        host: dbconf.host,
        port: dbconf.port || 3306,
        user: dbconf.user,
        password: dbconf.password,
        database: dbName
      },
      dumpToFile: destPath,
      compressFile: true
    })
  }
}

function _mongodump_promised(uri, rootDir) {
  return new Promise((resolve, reject) => {
    mongodump({
      uri: uri,
      root: rootDir,
      callback: (err) => {
        if (err) {
          console.error(err)
        }
        resolve()
      }
    })
  })
}

async function backupMongo(destDir, dbconf) {
  const port = dbconf.port || 3306
  let uri = undefined
  if (dbconf.user && dbconf.password) {
    uri = `mongodb://${dbconf.user}:${dbconf.password}@${dbconf.host}:${port}`
  } else {
    uri = `mongodb://${dbconf.host}:${port}`
  }

  console.log('start backup mongodb...')
  for (let dbName of dbconf.database) {
    console.log(`\tbackup ${dbName}`)
    const databaseUri = `${uri}/${dbName}`
    await _mongodump_promised(databaseUri, destDir)
  }
}

async function backup(backupConf) {
  for (let conf of backupConf.backups) {
    // check date folder and make new dir
    const dateStr = new Date().toLocaleDateString().replace(/[-: ]/g, '')
    const destDir = path.resolve(conf.destDir, dateStr)
    if (fs.existsSync(destDir)) {
      await del(`${destDir}/**`)
    }
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir)
    }

    // start backup
    if (conf.dbtype == 'mysql') {
      await backupMySql(destDir, conf.dbconf)
    } else if (conf.dbtype == 'mongodb') {
      await backupMongo(destDir, conf.dbconf)
    }
  }
}

module.exports = backup