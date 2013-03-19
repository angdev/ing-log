$(document).ready(function(){
	$.ajax({
		url: '/timeline/github',
		context: document.body
	}).done(function(data){
		$('#github').html(data);
	});
});