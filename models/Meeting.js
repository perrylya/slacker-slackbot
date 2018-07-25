var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Meeting = new Schema({
day:{
 type:String,
 required:true
},
time:{
 type:String,
 required:true
},
invitees:{
    type: String,
    required: false
},
action:{
    type:String,
    required: false
},
location: {
    type: String,
    required: false
},
meetingLength:{
    type: String,
    required: false 
},
GoogleCalenderFields:{
    type: String
},
Status:{
    type: String
},
CreatedAt:{
    type: String
},
RequestorId:{
    type: String
}
});
module.exports = mongoose.model('Meeting', Meeting);