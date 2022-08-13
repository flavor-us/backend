git pull origin main
npm i
pm2 stop app
pm2 start app --name app --update-env
sleep 2
pm2 list