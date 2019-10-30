const path = require('path')
const yml = require('yml')
const schedule = require('node-schedule')
const backup = require('./backup')

function main() {
  const backupConf = yml.load(path.resolve(__dirname, 'backup_conf.yml'))
  schedule.scheduleJob(backupConf.cron, () => {
    backup(backupConf)
  })
}

main()