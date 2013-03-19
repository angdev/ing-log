var ejs = require('ejs');

//html helper
ejs.filters.link_to = function(url, str) {
	return "<a href='" + url + "'>" + str + "</a>";
}

ejs.filters.script = function(url) {
	return "<script type='text/javascript' src='" + url + "'></script>";
}

ejs.filters.css = function(url) {
	return "<link rel='stylesheet' type='text/css' href='" + url + "' />";
}