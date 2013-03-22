//script for posting a article.

var colors = require('colors');
var readline = require('readline');
var mongoose = require('mongoose');
//db connect
mongoose.connect('mongodb://localhost/blog');
var article_model = require('./models/article');
var Article = mongoose.model('Article', article_model.schema);

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var category = 0;
var title = '';
var author = '';
var file_name = '';

rl.question('Want to do [post, find, remove] > ', function(answer) {
	var l_answer = answer.toLowerCase();
	if(l_answer === 'post') {
		PostArticle();
	}
	else if(l_answer === 'find') {
		FindArticle();
	}
	else if(l_answer === 'remove') {
		RemoveArticle();
	}
	else {
		console.log('Invalid command'.red);
		process.exit(0);
	}
});

function FindArticle() {
	rl.question("Title > ", function(answer) {
		Article.find({ title : new RegExp(answer) }, function(err, docs){
			if(!err) {
				for(var i in docs) {
					console.log(docs[i]);
				}
				process.exit(0);
			}
			else {
				console.log("Find Error".red);
				process.exit(0);
			}
		});
	});
}

function RemoveArticle() {
	rl.question("Title > ", function(answer) {
		Article.remove({ title: answer }, function(err) {
			if(err) {
				console.log('Remove Error'.red);
				console.log(err);
			}
			else {
				console.log('OK'.green);
			}
			process.exit(0);
		});	
	});
}

function PostArticle() {
	rl.question("Category > ", function(answer) {
		category = article_model.get_category_id(answer);
		rl.question("Title > ", function(answer) {
			title = answer;
			rl.question("Author > ", function(answer) {
				author = answer;
				rl.question("Post File Name > ", function(answer) {
					file_name = answer;
					InsertArticle();
				});
			});
		});
	});
}

function InsertArticle() {
	if(title === '' || author === '' || file_name === '') {
		console.log("Invalid input".red);
		process.exit(0);
	}
	var arti = new Article({
		'category': category,
		'title': title,
		'author': author,
		'content_path': file_name		
	});
	arti.save(function(err, a){ 
		if(err) {
			console.log('DB error'.red);
			process.exit(0);
		}
		else {
			console.log('OK'.green);
			process.exit(0);
		}
	});
}
