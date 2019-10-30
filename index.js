const path = require('path')
const yml = require('yml')
const backup = require('./backup')

function main() {
  const backupConf = yml.load(path.resolve(__dirname, 'backup_conf.yml'))
  backup(backupConf)
}

main()