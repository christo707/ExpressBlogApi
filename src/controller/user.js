import { Router } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from '../config';
import User from '../model/user';

export default ({ config, db }) => {
  let api = Router();

//Add a new User
//'/v1/users/add'
api.post('/add', (req, res) => {
    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.save(function(err) {
      if (err) {
        res.send(err);
      } else {
      res.json({ message: 'User Created successfully' });
      }
    });
  });

//Get All Users
//'/v1/users/'
  api.get('/', (req, res) => {
    User.find({}, (err, users) => {
      if (err) {
        res.send(err);
      } else if(Object.keys(users).length === 0) {
          res.json({ message: 'No Users Present' });
      } else {
        let usersRes = [];
        for(let i = 0; i < Object.keys(users).length; i++){
          usersRes[i] = { id: users[i].id, name : users[i].name, email: users[i].email }
        }
      res.json(usersRes);
      }
    });
  });

  // Get User By Id
  // '/v1/users/:id'
  api.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (err) {
        res.send(err);
      } else if(!user) {
          res.json({ message: 'User Not Found' });
      } else {
      res.json({ id: user.id, name : user.name, email: user.email });
      }
    });
  });

  // Get User By Email
  // '/v1/foodtruck/:email'
  api.get('/email/:mail', (req, res) => {
    User.find({email : req.params.mail}, (err, user) => {
      if (err) {
        res.send(err);
      } else if(Object.keys(user).length === 0) {
          res.json({ message: 'User Not Found' });
      } else {
      res.json({ id: user[0].id, name : user[0].name, email: user[0].email });
      }
    });
  });

  return api;
}
