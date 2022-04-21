const http = require('http');
const Room = require('./models/room');
const mongoose = require('mongoose');
mongoose
  .connect('mongodb://localhost:27017/hotel')
  .then(() => console.log('資料庫連線成功'))
  .catch((error) => console.log(error.reason));

// const roomSchema = {
//   name: String,
//   price: {
//     type: Number,
//     required: [true, 'price 必填'],
//   },
//   rating: Number,
// };

// Room > rooms
// user > users
// 開頭文字強制小寫
// 強制加 s
// Room.create({
//   name: '總統超級單人房',
//   price: 200,
//   rating: 4.5,
// })
//   .then(() => {
//     console.log('資料寫入成功');
//   })
//   .catch((error) => {
//     console.log(error.errors);
//   });

// 實例 實體 instance *******
// const testRoom = new Room({
//   name: '超級單人房7',
//   price: 2000,
//   rating: 4.5,
// });

// testRoom
//   .save()
//   .then(() => {
//     console.log('新增資料成功!');
//   })
//   .catch((error) => {
//     console.log(error.errors);
//   });

const requestListener = async (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json',
  };
  if (req.url == '/rooms' && req.method == 'GET') {
    const rooms = await Room.find(); // find()語法也是Promise
    res.writeHead(200,headers);
    res.write(JSON.stringify({
        "status":"success",
        rooms
    }))
  }
  res.end();
};

const server = http.createServer(requestListener);

server.listen(3005);
