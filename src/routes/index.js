import express from 'express';
import config from '../config';
import initializeDb from '../db';
import middleware from '../middleware';
import post from '../controller/post';
import user from '../controller/user';
import comment from '../controller/comment';
import account from '../controller/account';

let router = express();

// connect to db
initializeDb(db => {

  // internal middleware
  //router.use(middleware({ config, db }));

  // api routes v1 (/v1)
  let r = express.Router();
  router.use('/', r);
  r.get('/', (req, res) => {
      res.send('Blogs API is UP');
  });
  router.use('/users', user({ config, db }));
  router.use('/posts', post({ config, db }));
  router.use('/comments', comment({ config, db }));
  router.use('/account', account({ config, db }));
});

export default router;
