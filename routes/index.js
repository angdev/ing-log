
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
    return highlight(lang, code);
  }
});

function getPosts(category_name, callback) {
  var Article = mongoose.model('Article', article.schema);
  Article.find({ category: article.get_category_id(category_name) }).limit(5).sort({date: 'desc'}).exec(function(err, articles) {

    //content_path -> md files
    var default_path = path.join(__dirname, '../public', 'archives', category_name);

    for(var i in articles) {
      if(articles[i].content_path != null) {
        var file_path = path.join(default_path, articles[i].content_path, 'index.md');
        var archive_path = 'archives/' + category_name + '/' + articles[i].content_path;
        try {
          var file_content = fs.readFileSync(file_path, 'utf8');
          console.log(archive_path);
          articles[i].content = marked(file_content, null, archive_path);
        } catch(e) {
          //console.log(e);
          articles[i].content = "Archive cannot be found."
        }
      }
    }
    //console.log(articles);
    callback(articles);
  });
}

function get_post_content(articles, callback) {
  for(var i in articles) {
    var category_name = article.get_category_name(articles[i].category).toLowerCase();
    var file_path = path.join(__dirname, '../public', 'archives', category_name, articles[i].content_path, 'index.md');
    var archive_path = '/archives/' + category_name + '/' + articles[i].content_path;
    console.log(file_path);
    try {
      var file_content = fs.readFileSync(file_path, 'utf8');
      articles[i].content = marked(file_content, null, archive_path);
    } catch(e) {
      articles[i].content = "Archive cannot be found.";
    }
  }
  callback(articles);
}

function get_article_by_title(title, callback) {
  var Article = mongoose.model('Article', article.schema);
  Article.find({ 'title': title }).exec(function(err, _article) {
    get_post_content(_article, callback);
  });
}

exports.index = function(req, res){
  res.render('index');
};

exports.about = function(req, res) {

  //content_path -> md files
  var file_path = path.join(__dirname, '../public', 'archives', 'about', 'about.md');
  res.render('about', {'second_title': 'About', 'content': marked(fs.readFileSync(file_path, 'utf8'))});
}

exports.article = function(req, res) {
  if(req.params.title) {
    get_article_by_title(req.params.title, function(_article) {
      var category_name = article.get_category_name(_article.category);
      res.render('article', {
                'second_title': category_name,
                'articles': _article
      });
    });
  }
  else {
    exports.index(req, res);
  }
}

exports.post = function(req, res) {
    getPosts('post', function(articles) {
      res.render('post', {
        'second_title': 'Post',
        'articles': articles
      });
    });
}

exports.snippet = function(req, res) {
  getPosts('snippet', function(articles) {
    res.render('post', {
      'second_title': 'Snippet/Etc',
      'articles': articles
    });
  });
}

exports.slide = function(req, res) {
  res.render('slide', {
    'second_title': 'Presentation',
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
