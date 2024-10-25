const express = require('express');
const router = express.Router();



// Import controllers
const userController = require('../controller/UserController');
const articleController = require('../controller/ArticleController');
const categoryController = require('../controller/CategoryController');
// User
router.post('/user/register', userController.register);
router.post('/user/login', userController.Login);
router.post('/user/changepassword', userController.changePassword);

// Category
router.post('/category/add', categoryController.addCategory);
router.put('/category/update/:id', categoryController.updateCategory);
router.delete('/category/delete/:id', categoryController.deleteCategory);

//Artical

router.post('/article/post', articleController.postArticle);
router.put('/article/edit/:id', articleController.editArticle);
router.delete('/article/delete/:id', articleController.deleteArticle);
// Export router
module.exports = router;
