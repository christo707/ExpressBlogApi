import { Router } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../model/user';
import Account from '../model/account';
import { authenticate } from '../middleware/authMiddleware';

export default ({ config, db }) => {
  let api = Router();

//Add a new User
//'/v1/users/add'
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
        // Fetch the user by id
        Account.findById(accountId, (err, account) => {
          if(err || !account){
            if(!account){
              res.json({ message: 'User not Present' });
            }
              res.send(err);
          }
          console.log(account);
          let user = new User();
          user.name = req.body.name;
          user.accountid = account.id;
          user.username = account.username;
          user.save(function(err) {
            if (err) {
              res.send(err);
            } else {
            res.json({ message: 'User Created successfully' });
            }
          });
        });
    }
  });

//Get All Users
//'/v1/users/'
  api.get('/', authenticate, (req, res) => {
    User.find({}, (err, users) => {
      if (err) {
        res.send(err);
      } else if(Object.keys(users).length === 0) {
          res.json({ message: 'No Users Present' });
      } else {
        let usersRes = [];
        for(let i = 0; i < Object.keys(users).length; i++){
          usersRes[i] = { id: users[i].id, name : users[i].name, username: users[i].username }
        }
      res.json(usersRes);
      }
    });
  });

  // Get User By Id
  // '/v1/users/:id'
  api.get('/:id', authenticate, (req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (err) {
        res.send(err);
      } else if(!user) {
          res.json({ message: 'User Not Found' });
      } else {
      res.json({ id: user.id, name : user.name, username: user.username });
      }
    });
  });

  // Get User By Username
  // '/v1/foodtruck/:email'
  api.get('/username/:mail', (req, res) => {
    User.find({username : req.params.mail}, (err, user) => {
      if (err) {
        res.send(err);
      } else if(Object.keys(user).length === 0) {
          res.json({ message: 'User Not Found' });
      } else {
      res.json({ id: user[0].id, name : user[0].name, username: user[0].username });
      }
    });
  });

  return api;
}
