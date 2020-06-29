const express = require('express');

const studioRouter = express.Router();

studioRouter.get('/', function(req, res) {
	const spaceKey =  req.query['spaceKey']
	res.render('video-studio', {
		spaceKey: spaceKey
	});
});

studioRouter.get('/customCheck', function(req, res) {
	console.log("request", req)
	res.json({answer: 42})
});

export default studioRouter;
