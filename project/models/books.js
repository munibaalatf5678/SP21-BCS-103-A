const mongoose=require('mongoose')
const bookSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
  author_name:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,
    },image:
    {
        type:String,
        required:true
    },
    
});


module.exports = mongoose.model('books', bookSchema);
