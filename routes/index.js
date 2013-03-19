
/*
 * GET home page.
 */

var mongoose = require('mongoose');
var article = require('../models/article');
var path = require('path');
var fs = require('fs');
var marked = require('marked');
var highlight = require('highlight').Highlight;

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  langPrefix: 'language-',
  highlight: function(code, lang) {
  	return highlight(code);
  }
});

exports.index = function(req, res){
	res.render('index');
};

exports.about = function(req, res) {

	//content_path -> md files
	var file_path = path.join(__dirname, '../public', 'archives', 'about', 'about.md');
	res.render('about', {'second_title': 'About', 'content': marked(fs.readFileSync(file_path, 'utf8'))});
}

exports.post = function(req, res) {
	var Article = mongoose.model('Article', article.schema);
	Article.find().limit(5).sort({date: 'desc'}).exec(function(err, articles) {
		
		//content_path -> md files
		var default_path = path.join(__dirname, '../public', 'archives', 'posts');
		
		for(var i in articles) {
			if(articles[i].content_path != null) {
				var file_path = path.join(default_path, articles[i].content_path);
				try {
					articles[i].content = marked(fs.readFileSync(file_path, 'utf8'));
				} catch(e) {
					console.log(e);
					articles[i].content = "Archive cannot be found."
				}
			}
		}
		
		res.render('post', {
			'second_title': 'Post',
			'articles': articles
		});
	});	
}

exports.md = function(req, res) {
	//content_path -> md files
	var file_path = path.join(__dirname, '../public', 'archives', 'report', req.params.file);
	var content = '';
	try {
		content = marked(fs.readFileSync(file_path, 'utf8'));
	} catch(e) {
		console.log(e);
		content = "Archive cannot be found.";
		console.log(file_path);
	}
	res.render('markdown', {'content': content});
}

exports.project = function(req, res) {
	res.render('project', {'second_title': 'Project'});
}
