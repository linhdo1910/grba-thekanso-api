const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  createDate: { type: Date}, 
  title: { type: String, required: true }, 
  content: { type: String, required: true }, 
  image: { type: String, required: true },
  author:{type:String, required:true}, 
  categories: {
    type: String,
    required: true
},

});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
