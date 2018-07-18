import { Router } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../model/user';
import Post from '../model/post';
import Comment from '../model/comment';
import Account from '../model/account';
import { authenticate } from '../middleware/authMiddleware';


export default ({ config, db }) => {
  let api = Router();

//Add a new Comment
//'/v1/comments/add/:postid'
api.post('/add/:postid', authenticate, (req, res) => {

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
            Post.findById( req.params.postid, (err,post) => {
              if(err || !post){
                if(!post)
                  res.json({ message: 'Post Not Found' });
                else
                  res.send(err);
              } else {
                let comment = new Comment();
                comment.message = req.body.message;
                comment.postid = post.id;
                comment.userid = user.id;
                comment.save(function(err) {
                  if (err) {
                    res.send(err);
                  } else {
                    post.comments.push(comment);
                    post.save(function(err2) {
                      if (err2) {
                        res.send(err);
                      }
                      res.json({ message: 'Comment saved successfully' });
                    });
                  }
                });
              }
            });
          }
        });
      });
  }
});

//Get All Comment Of a Post
//'/v1/comments/posts/:postid'
  api.get('/posts/:postid', (req, res) => {
    Comment.find({postid : req.params.postid}, (err, comments) => {
      if (err) {
        res.send(err);
      } else if(Object.keys(comments).length === 0) {
          res.json({ message: 'No Comments Present' });
      } else {
      res.json(comments);
      }
    });
  });

  // Get Comment By ID
  // '/v1/comments/:id'
  api.get('/:id',authenticate, (req, res) => {
    Comment.findById( req.params.id, (err, comment) => {
      if (err) {
        res.send(err);
      } else if(!comment) {
          res.json({ message: 'Comment Not Found' });
      } else {
      res.json(comment);
      }
    });
  });

  // Get Comments By User ID
  // '/v1/comments/user/:userid'
  api.get('/user/:userid',authenticate, (req, res) => {
    Comment.find({userid: req.params.userid }, (err, comments) => {
      if (err) {
        res.send(err);
      } else if(Object.keys(comments).length === 0) {
          res.json({ message: 'No Comments Found' });
      } else {
      res.json(comments);
      }
    });
  });

  //Add Like to Comment
  //'/v1/comments/like/:commentid'
    api.put('/like/:commentid',authenticate, (req, res) => {
      Comment.findById( req.params.commentid, (err, comment) => {
        if (err) {
          res.send(err);
        } else if(!comment) {
          res.json({ message: 'No Comment Present' });
        } else {
          comment.likes = comment.likes + 1;
          comment.save(function(err2) {
            if (err2) {
              res.send(err2);
            } else {
              res.json({ message: 'Like Added successfully' });
            }
          });
        }
      });
    });

    //Edit Comment
    //'/v1/comments/edit/:commentid'
      api.put('/edit/:commentid', (req, res) => {

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
                    Comment.findById( req.params.commentid, (err, comment) => {
                      if (err) {
                              res.send(err);
                            } else if(!comment) {
                              res.json({ message: 'No Comment Present' });
                            } else if(comment.userid != user.id){
                              res.json({ message: 'Comment Not of login User' });
                            } else {
                              comment.message = req.body.message;
                              comment.save(function(err2) {
                                if (err2) {
                                  res.send(err2);
                                } else {
                                  res.json({ message: 'Comment Edited successfully' });
                                }
                              });
                            }
                          });
                }
              });
            });
        }

      });

      //Delete Comment
      // '/v1/comments/:commentid' -- Delete
      api.delete('/:commentid', (req, res) => {

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
                  Comment.findById( req.params.commentid, (err, comment) => {
                    if (err) {
                      res.send(err);
                    } else if(!comment) {
                      res.json({ message: 'No Comment Present' });
                    } else {
                      Post.findById(comment.postid, (err, post) => {
                        post.comments = post.comments.splice((post.comments).indexOf(req.params.commentid), 1);
                        post.save(function(err2) {
                          if (err2) {
                            res.send(err2);
                          } else {
                            Comment.remove({
                              _id: req.params.commentid
                            }, (err) => {
                              if (err) {
                                res.send(err);
                              }
                            res.json({ message: 'Comment Removed successfully' });
                        });
                      }
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
