const Category = require("../models/category.model");

const categoryController = {
  createCategory: async function (req, res, next) {
    try {
      const { content, startDate, endDate } = req.body;
      const checkCat = await Category.findOne({ content });

      if (checkCat)
        return res.status(400).json({ message: "The category is existed!!" });
      const cate = new Category({ content, startDate, endDate });
      await cate.save();
      res
        .status(200)
        .json({ message: "Category saved successfully!!!", data: cate });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAllCategory: async function (req, res, next) {
    try {
      const categories = await Category.find().populate({
        path: "post",
        populate: { path: "user", select: "-password" },
      });
      res.status(200).json({ message: "get all categories", data: categories });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteOneCategory: async function (req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      if (!category)
        return res.status(404).json({ message: "Can not find category!" });
      if (category.post?.length > 0)
        return res
          .status(400)
          .json({
            message: "You can not delete! The category have been the posts",
          });
      const catDeleted = await Category.findOneAndDelete({ _id: id });

      res
        .status(200)
        .json({ message: "delete category", data: { ...catDeleted._doc } });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateCategory: async function (req, res, next) {
    try {
      const { content, startDate, endDate } = req.body;

      const checkCat = await Category.findOne({ _id: req.params.id });

      if (!checkCat)
        return res.status(400).json({ message: "The category is existed!!" });

      const catUpdated = await Category.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { content, startDate, endDate } },
        { new: true }
      );

      res
        .status(200)
        .json({
          message: "Updated the category successfully!!!",
          data: { ...catUpdated._doc, content, startDate, endDate },
        });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = categoryController;
