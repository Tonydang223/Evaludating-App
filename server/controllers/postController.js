const Post = require("../models/post.model");
const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const Category = require("../models/category.model");
const uploads = require("../utils/cloudinary");
const fs = require("fs");
const managerController = {
  createPost: async (req, res, next) => {
    const { title, content, categoryId } = req.body;

    try {
      if (!title || !categoryId)
        return res
          .status(400)
          .json({ message: "Title and Category can not be empty!" });
      const checkCategory = await Category.findOne({ _id: categoryId });
      if (!checkCategory)
        return res.status(404).json({ message: "Category not found!" });
      const urlsImage = [];
      const files = req.files;
      for (const file of files) {
        const { path } = file;

        const newPaths = await uploads(path, "posts");

        const imgObj = {
          name: newPaths.original_filename,
          url: newPaths.url,
        };
        urlsImage.push(imgObj);
        fs.unlinkSync(path);
      }
      const post = new Post({
        title,
        content,
        category: categoryId,
        user: req.user.id,
        images: urlsImage,
      });
      await post.save();
      console.log(post._doc._id)
      await Category.findOneAndUpdate(
        { _id: categoryId },
        { $push: { post: post._doc._id } },
        { new: true }
      );
      res
        .status(200)
        .json({ message: "Post saved successfully!", data: post._doc });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updatePost: async (req, res, next) => {
    try {
      const { title, content, category } = req.body;
      if (!title || !category)
        return res
          .status(400)
          .json({ message: "Title and Category can not be empty!" });
      const post = await Post.findOne({ _id: req.params.id });
      if (!post)
        return res.status(400).json({ message: "The post is not existed!" });
      const postUpdated = await Post.findOneAndUpdate(
        { _id: req.params.id },
        { title, content, category }
      ).populate({ path: "user like comment", select: "-password" });

      res.status(200).json({
        message: "Updated successfully!",
        post: { ...postUpdated._doc, title, content, category },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deletePost: async (req, res, next) => {
    try {
    } catch (error) {}
  },
  getAllPost: async (req, res, next) => {
    try {
      const allPost = await Post.find()
        .populate({
          path: "user like",
          select: "-password",
        })
        .populate({
          path: "comment",
          populate: {
            path: "user",
            select: "-password",
          },
        });
      res
        .status(200)
        .json({ message: "get all post succesfully", data: allPost });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  likeAction: async function (req, res, next) {
    try {
      const post = await Post.findOne({ _id: req.params.id });
      const checkExistedLike = await Post.findOne({ like: req.user.id });
      console.log(
        "🚀 ~ file: postController.js ~ line 30 ~ checkExistedLike",
        checkExistedLike
      );
      if (checkExistedLike)
        return res.status(400).json({ message: "The user liked this post!" });
      if (!post)
        return res.status(404).json({ message: "The post is not existed!" });
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { like: req.user.id } },
        { new: true }
      );
      res.status(200).json({ message: "ok" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  unlike: async function (req, res, next) {
    try {
      const post = await Post.findOne({ _id: req.params.id });
      if (!post)
        return res.status(404).json({ message: "The post is not existed!" });
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { like: req.user.id } },
        { new: true }
      );
      res.status(200).json({ message: "unlike ok" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  postComment: async function (req, res, next) {
    try {
      const { postId, content } = req.body;
      if (!content)
        return res.status(400).json({ message: "Content must be provided!" });
      const post = await Post.findOne({ _id: postId });
      const checkPosted = await Comment.findOne({ post: postId });
      console.log(
        "🚀 ~ file: postController.js ~ line 76 ~ checkPosted",
        checkPosted
      );
      if (!post)
        return res.status(400).json({ message: "The post is not existed!" });
      if (checkPosted)
        return res.status(400).json({ message: "This comment is existed!" });

      const comment = new Comment({
        user: req.user.id,
        post: postId,
        content,
      });

      await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { comment: comment._id } },
        { new: true }
      );
      await comment.save();

      res.status(200).json({ message: "Comment created successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteComment: async function (req, res, next) {
    try {
      const { id } = req.params;

      const delComment = await Comment.findOneAndDelete(
        { _id: id },
        { $or: [{ user: req.user.id }] }
      );
      console.log(
        "🚀 ~ file: postController.js ~ line 114 ~ delComment",
        delComment
      );
      await Post.findOneAndUpdate(
        { _id: delComment.post },
        { $pull: { comment: id } },
        { new: true }
      );
      res.status(200).json({ message: "Delete successfully!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = managerController;
