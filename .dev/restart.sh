echo "\n\n\n\n------------------------------------\nRunning: git checkout main\n------------------------------------\n\n\n\n"
git checkout main

echo "\n\n\n\n------------------------------------\nRunning: git pull\n------------------------------------\n\n\n\n"
git pull

echo "\n\n\n\n------------------------------------\nRunning: cd /projects/shortify\n------------------------------------\n\n\n\n"
cd /projects/shortify

echo "\n\n\n\n------------------------------------\nRunnin: pm2 delete "shortify"\n------------------------------------\n\n\n\n"
pm2 delete "shortify"

echo "\n\n\n\n------------------------------------\nRunnin: pm2 save --force\n------------------------------------\n\n\n\n"
pm2 save --force

echo "\n\n\n\n------------------------------------\nRunning: sudo npm install --frozen-lockfile\n------------------------------------\n\n\n\n"
sudo npm install --frozen-lockfile

echo "\n\n\n\n------------------------------------\nRunning: sudo npm build\n------------------------------------\n\n\n\n"
sudo npm build

echo "\n\n\n\n------------------------------------\nRunning: pm2 start "npm -- start -p 3000" --name "shortify"\n------------------------------------\n\n\n\n"
pm2 start "npm -- start -p 3000" --name "shortify"

echo "\n\n\n\n------------------------------------\nRunning: pm2 save\n------------------------------------\n\n\n\n"
pm2 save

echo "\n\n\n\n------------------------------------\nRunning: pm2 startup\n------------------------------------\n\n\n\n"
pm2 startup