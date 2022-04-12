
const User = require('../models/user.model')
const Post = require('../models/post.model')
const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs');
const userController  = {
    getAllUser:async function (req, res, next) {
        try {
            const allStaff = await User.find({role:'employer'});
            res.status(200).json({ message: "get all users successfullly!!!",data:allStaff })
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        
    },
    downloadfileCSV:async function (req, res, next) {
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
            const data = [
                {code: 'CA', name: 'California'},
                {code: 'TX', name: 'Texas'},
                {code: 'NY', name: 'New York'},
              ];
            const csv = new ObjectsToCsv(data);
             
            // Save to file:
            await csv.toDisk('./downloads/posts.csv');
            return res.download('./downloads/posts.csv',()=>{
                fs.unlinkSync('./downloads/posts.csv');
            })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
module.exports = userController