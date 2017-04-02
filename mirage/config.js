export default function() {
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
  this.get('tasks/:id');
}
