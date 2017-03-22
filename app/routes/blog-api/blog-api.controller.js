var Blog = require('../../models/blog.model.js')

var blogCtrl = function(){

	function get(req, res){
		console.log("hello wer're in blogCtrl get");
		Blog.find(function(err, blogs){
			if(err)
			{
				res.status(500);
				res.send(err);
			}
			else
			{
				res.json(blogs);
			}
		});

	}

	function post(req, res){
		console.log("hello wer're in blogCtrl post");

		var blog = new Blog();
		blog.text = req.body.text;
		blog.title = req.body.title;

		blog.save(function(error){
			if(error){
				res.status(500);
				res.send("Unexpected error. Blog could not save correctly please try again later");
			}
			else{
				res.status(201);
				res.send("Blog saved successfully")
			}
		})
	}

	return {
		get: get,
		post: post
	};
}

module.exports = blogCtrl();