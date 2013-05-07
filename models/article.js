var mongoose = require('mongoose');

var article_schema = mongoose.Schema({
	category: Number,
	title: String,
	author: String,
	content_path: String,
	date: {
		type: Date,
		default: Date.now
	},
	hidden: {
		type: Boolean,
		default: false
	}
});

exports.schema = article_schema;
exports.get_category_id = function category(name) {
	name = name.toLowerCase();
	switch(name) {
		case 'post': return 0; break;
		case 'snippet': return 1; break;
		default:
			process.exit(0);
			break;
	}
}
exports.get_category_name = function(id) {
  switch(id) {
  case 0:
    return 'Post';
  case 1:
    return 'Snippet/Etc';
  }
}
