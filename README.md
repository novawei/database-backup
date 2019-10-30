# database-backup
config with backup_conf.yml

## backup
```javascript
yarn backup
```

## scheduled backup use Cron
```javascript
yarn schedule
// or
pm2 start ./backup_scheduled.js --name database-backup
```