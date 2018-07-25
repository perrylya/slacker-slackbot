var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Task = new Schema({
action:{
 type:String,
 required:true
},
day:{
 type:String,
 required:true
},
eventId:{
    type: String
},
requesterId:{
    type:String
}
});
module.exports = mongoose.model('Task', Task);