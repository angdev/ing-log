var GithubApi = require('github');
	 
exports.github = function(req, res){
	//github test
	var github = new GithubApi({
		version: "3.0.0",
	});
	
	github.events.getFromUser({
		user: "FeGs",
		page: 1,
		per_page: 5
	}, function(err, data) {
		res.render('github', {github: data});
	});
};