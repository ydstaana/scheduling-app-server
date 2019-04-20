var Schedule = require('../../models/schedules/ScheduleSchema.js');

function createSchedule(req, res) {
  Schedule.create(req.body, function (err, sched) {
    if (err) {
      res.status(422).json({
        message: err
      });
    }
    else{
      res.status(200).send(sched);
    }
  });
};

function listSchedules(req, res) {
  Schedule.find(req.query, function(err, scheds) {
    if (err) {
      res.status(422).json({
        message: err
      });
    }
    else{
      res.status(200).send(scheds);
    }
  })
}

async function updateSchedule(req, res) {
  const doc = await Schedule.findById(req.params.id);
  doc.set(req.body);
  doc.save().then(() => {
    res.status(200).send(doc);
  })
  .catch(err => {
    res.status(422).json({code:'422', message: err});
  });
}

module.exports = {
  createSchedule : createSchedule,
  listSchedules : listSchedules,
  updateSchedule: updateSchedule
}