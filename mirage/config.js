export default function() {
  this.namespace = 'api/v1';

  this.get('/days', function(schema) {
    // return only days with a non-null `date`
    return schema.days.all().filter(day => day.date);
  });

  this.get('/days/:date', function(schema, request) {
    let date = request.params.date;
    if (date === 'undated') {
      date = null;
    }
    let day = schema.days.where({ date }).models[0];
    return day || schema.days.create({ date });
  });

  this.get('tasks/:id');
}
