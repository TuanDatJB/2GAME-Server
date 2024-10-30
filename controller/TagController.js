const Tag = require('../models/Tag');

class TagController {
    // Thêm tag mới
    async create(req, res) {
        try {
            const newTag = new Tag(req.body);
            const savedTag = await newTag.save();
            res.status(201).json(savedTag);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Cập nhật tag
    async update(req, res) {
        try {
            const updatedTag = await Tag.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!updatedTag) {
                return res.status(404).json({ message: 'Không tìm thấy tag' });
            }
            res.json(updatedTag);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Xóa tag
    async delete(req, res) {
        try {
            const deletedTag = await Tag.findByIdAndDelete(req.params.id);
            if (!deletedTag) {
                return res.status(404).json({ message: 'Không tìm thấy tag' });
            }
            res.json({ message: 'Đã xóa tag thành công' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TagController();

