const Posts = require('./models/posts');
const headers = require('./headers');
const handleSuccess = require('./handleSuccess');
const handleError = require('./handleError');
const mongoose = require('mongoose');

require('./connections')

const app = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  }); // chunk 是一段亂碼
  const {url, method} =req;
  console.log(method, url);

  if (req.url == '/posts' && req.method == 'GET') {
    const allPosts = await Posts.find(); // find() 語法也是Promise
    handleSuccess(res, allPosts);
  } else if (req.url == '/posts' && req.method == 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        if (data.content) {
          const newPost = await Posts.create({
            name: data.name,
            content: data.content,
            tags: data.tags,
            type: data.type,
          });
          handleSuccess(res, newPost);
        } else {
          handleError(res);
        }
      } catch (error) {
        handleError(res, error);
      }
    });
  } else if (req.url == '/posts' && req.method == 'DELETE') {
    const deletePosts = await Posts.deleteMany({});
    handleSuccess(res, deletePosts);
  } else if (req.url.startsWith('/posts/') && req.method == 'DELETE') {
    const id = req.url.split('/').pop();
    if (id !== "") {
      const deletePost = await Posts.deleteOne({
        "_id":new mongoose.Types.ObjectId(id)
      })
      handleSuccess(res, deletePost);
    } else {
      handleError(res);
    }
  } else if (req.url == '/posts' && req.method == 'OPTIONS') {
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

module.exports = app;