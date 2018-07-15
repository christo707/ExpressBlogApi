import { Router } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from '../config';
import User from '../model/user';
import Post from '../model/post';
import Comment from '../model/comment';

export default ({ config, db }) => {
  let api = Router();

//Add a new Comment
//'/v1/comments/add/:postid'
api.post('/add/:postid', (req, res) => {
  Post.findById( req.params.postid, (err,post) => {
    if(err || !post){
      if(!post)
        res.json({ message: 'Post Not Found' });
      else
        res.send(err);
    } else {
      let comment = new Comment();
      comment.message = req.body.message;
      comment.postid = post._id;
      comment.userid = req.body.userid;
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
  api.get('/:id', (req, res) => {
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
  api.get('/user/:userid', (req, res) => {
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
    api.put('/like/:commentid', (req, res) => {
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
        Comment.findById( req.params.commentid, (err, comment) => {
          if (err) {
            res.send(err);
          } else if(!comment) {
            res.json({ message: 'No Comment Present' });
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
      });

      //Delete Comment
      // '/v1/comments/:commentid' -- Delete
      api.delete('/:commentid', (req, res) => {
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
      });

      return api;
    }
