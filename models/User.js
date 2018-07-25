import mongoose from 'mongoose'

var UserSchema = new mongoose.Schema({
Meeting:{
 type: Number ,
 default: 30
},
SlackId:{
    type: String
},
googleTokens:{
    type: Object,
    required: true
},
pending:{
    date:String,
    description: String
}
});
var User = mongoose.model('User', UserSchema);
export default User;
