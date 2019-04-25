var mongoose = require('mongoose');

var ScheduleSchema = new mongoose.Schema({
  startDate : { type : Date, required : true},
  endDate : { type : Date, required : true},
  isActive : Boolean
});

ScheduleSchema.pre('validate', async function(next) {
  var sched = await Schedule.findOne({
    startDate : this.startDate,
    endDate : this.endDate
  })

  console.log("WHATT")
  console.log(sched);
  
  if(sched) {
    next(new Error('Schedule already exists'));
  }
  else 
    next();
});

var Schedule = mongoose.model('Schedule', ScheduleSchema);

module.exports = Schedule;