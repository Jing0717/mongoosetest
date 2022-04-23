const http = require('http');
const Room = require('./models/room');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

console.log(process.env.PORT);

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log('資料庫連線成功'))
  .catch((error) => console.log(error.reason));

const requestListener = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  }); // chunk 是一段亂碼

  const headers = {
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json',
  };

  if (req.url == '/rooms' && req.method == 'GET') {
    const rooms = await Room.find(); // find() 語法也是Promise
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        rooms,
      })
    );
    res.end();
  } else if (req.url == '/rooms' && req.method == 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const newRoom = await Room.create({
          name: data.name,
          price: data.price,
          rating: data.rating,
        });
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: 'success',
            rooms: newRoom,
          })
        );
        res.end();
      } catch (error) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: 'false',
            message: '欄位沒有正確，或沒有此ID',
            error: error,
          })
        );
        res.end();
      }
    });
  } else if (req.url == '/rooms' && req.method == 'DELETE') {
    const rooms = await Room.deleteMany({});
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        rooms: [],
      })
    );
    res.end();
  } else if (req.url == '/rooms' && req.method == 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: 'false',
        message: '無此網站路由',
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);

server.listen(process.env.PORT);
