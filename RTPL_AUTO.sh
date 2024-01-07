npm install
npm audit fix --force
npm funds
node utils/migrate
npm install pm2
pm2 stop rtplApi
pm2 delete rtplApi
pm2 start server.js --name rtplApi
pm2 logs
