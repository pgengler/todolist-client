export default function() {
  this.namespace = 'api/v1';

  this.get('/days', function(db) {
    // return only days with a non-null `date`
    let days = db.days.filter(day => day.date);
    let tasks = [ ];
    days.forEach(day => {
      let dailyTasks = db.tasks.filter(task => day.task_ids.contains(task.id));
      tasks = tasks.concat(dailyTasks);
    });

    return { days, tasks };
  });

  this.get('/days/:date', function(db, request) {
    let date = request.params.date;
    if (date === 'undated') {
      date = null;
    }
    let day = db.days.where({ date });
    if (day && day.length) {
      day = day[0];
    } else {
      day = db.days.insert({ date });
    }
    let tasks = db.tasks.filter(task => day.task_ids && day.task_ids.contains(task.id));
    return { day, tasks };
  });

  this.get('tasks/:id');
}
