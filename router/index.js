const express = require('express');
const router = express.Router();



// Import controllers
const userController = require('../controller/UserController');
const articleController = require('../controller/ArticleController');
const categoryController = require('../controller/CategoryController');
const gameController = require('../controller/GameController');
const commentController = require('../controller/CommentController');
const tagController = require('../controller/TagController');
// User
router.post('/user/register', userController.register);
router.post('/user/login', userController.Login);
router.post('/user/changepassword', userController.changePassword);
router.get('/user/get', userController.getAllUsers);
// Category
router.post('/category/add', categoryController.addCategory);
router.put('/category/update/:id', categoryController.updateCategory);
router.delete('/category/delete/:id', categoryController.deleteCategory);
router.get('/category/get', categoryController.getAllCategories);

//Artical

router.post('/article/post', articleController.postArticle);
router.put('/article/edit/:id', articleController.editArticle);
router.delete('/article/delete/:id', articleController.deleteArticle);
router.get('/article/get', articleController.getAllArticles);
// Game
router.post('/game/add', gameController.addGame);
router.put('/game/update/:id', gameController.updateGame);
router.delete('/game/delete/:id', gameController.deleteGame);

// Comment
router.post('/comment/add', commentController.addComment);
router.put('/comment/update/:id', commentController.updateComment);
router.delete('/comment/delete/:id', commentController.deleteComment);

// Tag
router.post('/tag/add', tagController.create);
router.put('/tag/update/:id', tagController.update);
router.delete('/tag/delete/:id', tagController.delete);

// Export router
module.exports = router;
