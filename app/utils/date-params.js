export default function(date) {
	var params = {
		after_days: 3,
		before_days: 1,
		date: moment().format('YYYY-MM-DD')
	};
	if (date) {
		params.date = date;
	}
	return params;
}
