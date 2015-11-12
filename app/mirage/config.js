export default function() {

  this.namespace = 'api/v1';
  this.get('/days', function(db) {
    // return only days with a non-null `date`
    let days = db.days;
    days = days.filter(day => day.date);
    return { days };
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
    return { day };
  });

}
