import { Router } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import config from '../config';
import User from '../model/user';
import Post from '../model/post';
import Comment from '../model/comment';
import Account from '../model/account';
import { authenticate } from '../middleware/authMiddleware';

export default ({ config, db }) => {
  let api = Router();

//Add a new Post
//'/v1/posts/add'
api.post('/add', authenticate, (req, res) => {
      if (req.headers && req.headers.authorization) {
          var authorization = req.headers.authorization,
              decoded;
          try {
            decoded = jwt.verify(authorization.split(' ')[1], config.SECRET);
          } catch (e) {
            console.log(e);
              return res.status(401).send('unauthorized');
          }
          var accountId = decoded.id;
          Account.findById(accountId, (err, account) => {
            if(err || !account){
              if(!account){
                res.json({ message: 'User not Present' });
              }
                res.send(err);
            }
            User.findOne( { accountid : account.id }, (err,user) => {
              if(err || !user){
                if(!user)
                  res.json({ message: 'User Not Found' });
                else
                  res.send(err);
              } else {
                let post = new Post();
                post.title = req.body.title;
                post.content = req.body.content;
                post.userid = user.id;
                post.save(function(err) {
                  if (err) {
                    res.send(err);
                  } else {
                    res.json({ message: 'Post Created successfully' });
                  }
                });
              }
            });
          });
      }
});

//Get All Posts
//'/v1/posts/'
  api.get('/', (req, res) => {
    Post.find({}, (err, posts) => {
      if (err) {
        res.send(err);
      } else if(Object.keys(posts).length === 0) {
          res.json({ message: 'No Posts Present' });
      } else {
      res.json(posts);
      }
    });
  });

  // Get Post By ID
  // '/v1/posts/:id'
  api.get('/:id', (req, res) => {
    Post.findById( req.params.id, (err, post) => {
      if (err) {
        res.send(err);
      } else if(!post) {
          res.json({ message: 'Post Not Found' });
      } else {
      res.json(post);
      }
    });
  });

  // Get Post By User ID
  // '/v1/posts/:id'
  api.get('/user/:userid', (req, res) => {
    Post.find({userid: req.params.userid }, (err, posts) => {
      if (err) {
        res.send(err);
      } else if(Object.keys(posts).length === 0) {
          res.json({ message: 'No Post Found' });
      } else {
      res.json(posts);
      }
    });
  });

  //Edit Posts
  //'/v1/posts/edit/:postid'
    api.put('/edit/:postid', authenticate, (req, res) => {

      if (req.headers && req.headers.authorization) {
          var authorization = req.headers.authorization,
              decoded;
          try {
            decoded = jwt.verify(authorization.split(' ')[1], config.SECRET);
          } catch (e) {
            console.log(e);
              return res.status(401).send('unauthorized');
          }
          var accountId = decoded.id;
          Account.findById(accountId, (err, account) => {
            if(err || !account){
              if(!account){
                res.json({ message: 'User not Present' });
              }
                res.send(err);
            }
            User.findOne( { accountid : account.id }, (err,user) => {
              if(err || !user){
                if(!user)
                  res.json({ message: 'User Not Found' });
                else
                  res.send(err);
              } else {
                Post.findById( req.params.postid, (err, post) => {
                  if (err ) {
                    res.send(err);
                  } else if(!post) {
                    res.json({ message: 'No Posts Present' });
                  } else if(post.userid != user.id){
                    res.json({ message: 'Post not of login user' });
                  } else {
                    post.title = req.body.title;
                    post.content = req.body.content;
                    post.save(function(err2) {
                      if (err2) {
                        res.send(err2);
                      } else {
                        res.json({ message: 'Post Edited successfully' });
                      }
                    });
                  }
                });
              }
            });
          });
      }


    });

    //Like Post
    //'/v1/posts/like/:postid'
      api.put('/like/:postid', authenticate, (req, res) => {
        Post.findById( req.params.postid, (err, post) => {
          if (err) {
            res.send(err);
          } else if(!post) {
            res.json({ message: 'No Post Present' });
          } else {
            post.likes = post.likes + 1;
            post.save(function(err2) {
              if (err2) {
                res.send(err2);
              } else {
                res.json({ message: 'Like Added successfully' });
              }
            });
          }
        });
      });

      //Delete Post
      // '/v1/posts/:postid'
      api.delete('/:postid', (req, res) => {
        if (req.headers && req.headers.authorization) {
            var authorization = req.headers.authorization,
                decoded;
            try {
              decoded = jwt.verify(authorization.split(' ')[1], config.SECRET);
            } catch (e) {
              console.log(e);
                return res.status(401).send('unauthorized');
            }
            var accountId = decoded.id;
            // Fetch the user by id
            Account.findById(accountId, (err, account) => {
              if(err || !account){
                if(!account){
                  res.json({ message: 'User not Present' });
                }
                  res.send(err);
              }
              User.findOne( { accountid : account.id }, (err,user) => {
                if(err || !user){
                  if(!user)
                    res.json({ message: 'User Not Found' });
                  else
                    res.send(err);
                } else {
                  Post.findById( req.params.postid, (err, post) => {
                    if (err ) {
                      res.send(err);
                    } else if(!post) {
                      res.json({ message: 'No Posts Present' });
                    } else if(post.userid != user.id){
                      res.json({ message: 'Post not of login user' });
                    } else {
                      Post.remove({
                        _id: req.params.postid
                      }, (err) => {
                        if (err) {
                          res.send(err);
                        }
                        Comment.find({postid: req.params.postid}).remove((err, comments) => {
                          if(err){
                            res.send(err);
                          }
                            res.json({ message: 'Post and its comment Removed successfully' });
                        });
                      });
                    }
                  });
                }
              });
            });
        }


      });

  return api;
}
