const Article = require('../models/Article');
const { uploadCloud } = require('../config/cloudinary.config');

const postArticle = async (req, res) => {
  try {
    uploadCloud(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Image upload failed', error: err });
      }

      const { title, content, author, category, tags, videos } = req.body;
      const images = req.files && req.files.length > 0 ? req.files.map(file => file.path) : [];

      const newArticle = new Article({
        title,
        content,
        author,
        category,
        tags,
        images,
        videos
      });

      await newArticle.save();
      res.status(201).json({ message: 'Article posted successfully', article: newArticle });
    });
  } catch (error) {
    console.error('Error posting article:', error);
    res.status(500).json({ message: 'Error posting article' });
  }
};

const editArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, tags, isPublished, videos } = req.body; // Không bao gồm content ở đây

    // Upload images
    uploadCloud(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Image upload failed', error: err });
      }

      let updateData = { title, category, tags, isPublished, videos };

      // Kiểm tra và cập nhật nội dung
      if (req.body.content && req.body.contentIndex !== undefined) {
        const contentIndex = parseInt(req.body.contentIndex);
        const existingArticle = await Article.findById(id);

        if (!existingArticle || !existingArticle.content[contentIndex]) {
          return res.status(404).json({ message: 'Invalid content index' });
        }

        // Thay thế nội dung tại vị trí chỉ định
        existingArticle.content[contentIndex] = req.body.content; // Cập nhật content
        updateData.content = existingArticle.content; // Cập nhật updateData
      }

      // Cập nhật hình ảnh nếu có file upload
      if (req.files && req.files.length > 0) {
        const images = req.files.map(file => file.path);

        // Kiểm tra nếu có imageIndex từ form-data để thay thế ảnh tại vị trí chỉ định
        if (req.body.imageIndex !== undefined) {
          const imageIndex = parseInt(req.body.imageIndex);
          const existingArticle = await Article.findById(id);

          if (!existingArticle || !existingArticle.images[imageIndex]) {
            return res.status(404).json({ message: 'Invalid image index' });
          }
          
          // Thay thế ảnh tại vị trí chỉ định
          existingArticle.images[imageIndex] = images[0];
          updateData.images = existingArticle.images;
        } else {
          // Nếu không có chỉ số thì thay toàn bộ ảnh
          updateData.images = images;
        }
      }

      const updatedArticle = await Article.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedArticle) {
        return res.status(404).json({ message: 'Article not found' });
      }

      res.status(200).json({ message: 'Article updated successfully', article: updatedArticle });
    });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ message: 'Error updating article' });
  }
};



const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedArticle = await Article.findByIdAndDelete(id);

    if (!deletedArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ message: 'Error deleting article' });
  }
};

const getAllArticles = async (req, res) => {
  try {
    // Lấy các tham số query từ request
    const { page = 1, limit = 10, category, tags } = req.query;
    
    // Xây dựng query filter
    let query = {};
    if (category) query.category = category;
    if (tags) query.tags = { $in: tags.split(',') };

    // Tính toán skip để phân trang
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Thực hiện query với phân trang
    const articles = await Article
      .find(query)
      .populate('category tags author', 'name username')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username avatarUrl' }, // Only fetch 'username' from comment user
        select: 'content createdAt', // Only fetch 'content' from comments
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Đếm tổng số bài viết thỏa mãn điều kiện
    const total = await Article.countDocuments(query);

    res.status(200).json({
      message: 'Articles retrieved successfully',
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      total,
      data: articles
    });
  } catch (error) {
    console.error('Error getting articles:', error);
    res.status(500).json({ message: 'Error getting articles' });
  }
};

module.exports = { postArticle, editArticle, deleteArticle, getAllArticles };
