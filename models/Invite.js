var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Invite = new Schema({
eventId:{
 type:String
},
inviteId:{
 type:String
},
requesterId:{
    type: String
},
status:{
    type:String
}
});
module.exports = mongoose.model('Invite', Invite);