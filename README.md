Backend of a Blog using Node.js, express.js, MongoDB
Rest API for CRUD operations for users, posts and comments
Installation
git clone git clone https://github.com/christo707/ExpressBlogApi.git

cd BlogProj

npm install

npm install --dev

Install and run MongoDB

npm run dev

Collections created
1 Users

id, name, password, email

2 Posts

id, title, content, likes, userid, datecreated, [ comments ]

3 Comments

id, message, datecreated, likes, userid, postid

Rest API Developed
host = http://localhost:3000

1 Add a new User - '{{host}}/v1/users/add'

2 Get All Users - '{{host}}/v1/users/'

3 Get User By Id - '{{host}}/v1/users/:id'

4 Get User By Email - '{{host}}/v1/foodtruck/:email'

5 Add a new Post - '{{host}}/v1/posts/add/:userid'

6 Get All Posts - '{{host}}/v1/posts/'

7 Get Post By ID - '{{host}}/v1/posts/:id'

8 Get Post By User ID - '{{host}}/v1/posts/:id'

9 Add Like to Posts - '{{host}}/v1/posts/like/:postid'

10 Edit Post - '{{host}}/v1/posts/edit/:postid'

11 Delete Post - '{{host}}/v1/posts/:postid'

12 Add a new Comment - '{{host}}/v1/comments/add/:postid'

13 Get All Comment Of a Post - '{{host}}/v1/comments/posts/:postid'

14 Get Comment By ID - '{{host}}/v1/comments/:id'

15 Get Comments By User ID - '{{host}}/v1/comments/user/:userid'

16 Add Like to Comment - '{{host}}/v1/comments/like/:commentid'

17 Edit Comment - '{{host}}/v1/comments/edit/:commentid'

18 Delete Comment - '{{host}}/v1/comments/:commentid' -- Delete
