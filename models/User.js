import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI)

var UserSchema = new mongoose.Schema({
Meeting:{
 type: Number ,
 default: 30
},
SlackId:{
    type: String
},
googleTokens:{
    tokens: {}
},
pending:{
    date:String,
    description: String 
}
});
var User = mongoose.model('User', UserSchema);
module.exports = User