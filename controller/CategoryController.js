const Category = require('../models/Category');

const categoryController = {
  // Add a new category
  addCategory: async (req, res) => {
    try {
      const { name, description } = req.body;
      const newCategory = new Category({ name, description });
      await newCategory.save();
      res.status(201).json({ message: 'Category added successfully', category: newCategory });
    } catch (error) {
      console.error('Error adding category:', error);
      res.status(500).json({ message: 'Error adding category' });
    }
  },

  // Update an existing category
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const updatedCategory = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ message: 'Error updating category' });
    }
  },

  // Delete a category
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCategory = await Category.findByIdAndDelete(id);
      if (!deletedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'Error deleting category' });
    }
  },

  // Get all categories
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (error) {
      console.error('Error getting categories:', error);
      res.status(500).json({ message: 'Error getting categories' });
    }
  },

};

module.exports = categoryController;