const Game = require('../models/Game');
const { uploadCloud } = require('../config/cloudinary.config');

// Thêm game mới
const addGame = async (req, res) => {
  try {
    uploadCloud(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Image upload failed', error: err });
      }

      const { title, description, platforms, releaseDate, genre, rating } = req.body;
      const images = req.files.map(file => file.path);

      const newGame = new Game({
        title,
        description,
        platforms,
        releaseDate,
        genre,
        rating,
        images
      });

      await newGame.save();
      res.status(201).json({ message: 'Game added successfully', game: newGame });
    });
  } catch (error) {
    console.error('Error adding game:', error);
    res.status(500).json({ message: 'Error adding game' });
  }
};

// Cập nhật game
const updateGame = async (req, res) => {
  try {
    const { id } = req.params;

    uploadCloud(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Image upload failed', error: err });
      }

      const { title, description, platforms, releaseDate, genre, rating } = req.body;
      let updateData = {
        title,
        description,
        platforms,
        releaseDate,
        genre,
        rating
      };

      // Cập nhật hình ảnh nếu có file upload
      if (req.files && req.files.length > 0) {
        const images = req.files.map(file => file.path);

        // Kiểm tra nếu có imageIndex từ form-data để thay thế ảnh tại vị trí chỉ định
        if (req.body.imageIndex !== undefined) {
          const imageIndex = parseInt(req.body.imageIndex);
          const existingGame = await Game.findById(id);

          if (!existingGame || !existingGame.images[imageIndex]) {
            return res.status(404).json({ message: 'Invalid image index' });
          }
          
          // Thay thế ảnh tại vị trí chỉ định
          existingGame.images[imageIndex] = images[0];
          updateData.images = existingGame.images;
        } else {
          // Nếu không có chỉ số thì thay toàn bộ ảnh
          updateData.images = images;
        }
      }

      const updatedGame = await Game.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!updatedGame) {
        return res.status(404).json({ message: 'Game not found' });
      }

      res.status(200).json({ message: 'Game updated successfully', game: updatedGame });
    });
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ message: 'Error updating game' });
  }
};

// Xóa game
const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedGame = await Game.findByIdAndDelete(id);

    if (!deletedGame) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ message: 'Error deleting game' });
  }
};

const getAllGames = async (req, res) => {
  try {
    const games = await Game.find(); // Retrieve all games from the database
    res.status(200).json(games); // Send the games as a JSON response
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Error fetching games' });
  }
};

module.exports = { addGame, updateGame, deleteGame, getAllGames };
