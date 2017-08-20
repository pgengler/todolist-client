export default function() {
  this.logging = true;
  this.namespace = '/api/v1';

  this.get('/days', function(schema, request) {
    let requestedDate = request.queryParams.date;
    if (requestedDate && !(request.queryParams.before_days || request.queryParams.after_days)) {
      requestedDate = (requestedDate === 'undated' ? null : requestedDate);
      let day = schema.days.findBy({ date: requestedDate });
      if (!day) {
        day = schema.days.create({ date: requestedDate });
      }

      return day;
    }
    return schema.days.all().filter((day) => day.date);
  });

  this.get('/days/:id');
  this.get('/tasks/:id');
  this.get('/recurring_task_days', function() {
    return [];
  });

  this.namespace = '/api/v2';

  this.get('/days', function({ days }, request) {
    let matchingDays = days.all();
    if (request.queryParams['filter[date]']) {
      let dates = request.queryParams['filter[date]'];
      dates.forEach((date) => {
        if (!days.findBy({ date })) {
          days.create({ date });
        }
      });
      matchingDays = days.all().filter((day) => dates.includes(day.date));
    }
    if (request.queryParams.date) {
      let date = request.queryParams.date;
      matchingDays = days.findBy({ date });
      if (!matchingDays) {
        matchingDays = days.create({ date });
      }
    }
    return matchingDays;
  });
  this.get('/tasks');
  this.get('/tasks/:id');
}
