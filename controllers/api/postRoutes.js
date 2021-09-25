const router = require('express').Router();
const { Comment, Post, User} = require('../../models');
const withAuth = require('../../Utils/auth');

// get all users
router.get('/', (req, res) => {
  Post.findAll({
    attributes: [
      'id',  
      'title',
      'content',
      'created_at',
    ],
    order: [['created_at', 'DESC']],
    include: [
      {
        model: Comment,
        attributes: [
          'id',
          'comment_text',
          'post_id',
          'user_id',
          'created_at'
        ],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  }).then(postData => res.json(postData.reverse))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
 });

// get one record
router.get('/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id', 
      'content', 
      'title', 
      'created_at',
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  }).then(postData => {
      if (!postData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(postData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

 // create a post
 router.post('/', (req, res) => {
  Post.create({
    title: req.body.title,
    content: req.body.content,
    user_id: req.session.user_id

  }).then(postData => res.json(postData))

    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});
// update a post
router.put('/:id',  withAuth, (req, res) => {
  Post.update(
    {
      title: req.body.title,
      content: req.body.content,
      user_id: req.body.user_id 
    },
    {
      where: {id: req.params.id}
    }).then(postData => {
      if (!postData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(postData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// delete a post
router.delete('/:id', (req, res) => {
// Delete multiple instances, in this case just where the id has been selected
  Post.destroy(
    {
      where: {
        id: req.params.id
      }
  })
    .then(postData => {
      if(!postData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(postData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});
  
module.exports = router;