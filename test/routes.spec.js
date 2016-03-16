var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);
var models = require('../models');
var expect = require('chai').expect;
var Page = models.Page;
var User = models.User;

describe('http requests', function () {

  describe('GET /', function () {
	  it('gets 200 on index', function (done) {
	    agent
	    .get('/')
	    .expect(200, done);
	  });
	});

  describe('GET /wiki/add', function () {
    it('responds with 200', function(done){
    	agent
    	.get('/wiki/add')
    	.expect(200, done);
    });
  });

  describe('GET /wiki/:urlTitle', function () {
  	var testPage;
  	beforeEach(function() {
      testPage = new Page();
      testPage.title = "Hello there";
      testPage.content = "Hello there";
      testPage.save();
    });
    it('responds with 404 on page that does not exist', function(done){
    	agent
    	.get('/wiki/blueberries')
    	.expect(404, done);
    });
    it('responds with 200 on page that does exist', function(done) {
    	agent
    	.get('/wiki/Hello_there')
    	.expect(200, done);
    });
    afterEach(function(done) {
      Page.remove({title : "Hello there"})
      .then(function(){
        done();
      })
      .then(null, function(err){
        console.error(err);
        done();
      });
    });
  });

  describe('GET /wiki/search', function () {
    it('responds with 200', function(done){
    	agent
    	.get('/wiki/search')
    	.expect(200, done);
    });
  });

  describe('GET /wiki/:urlTitle/similar', function () {
  	var testPage;
  	beforeEach(function() {
      testPage = new Page();
      testPage.title = "Hello there";
      testPage.content = "Hello there";
      testPage.save();
    });
    afterEach(function(done) {
      Page.remove({title : "Hello there"})
      .then(function(){
        done();
      })
      .then(null, function(err){
        console.error(err);
        done();
      });
    });
    it('responds with 404 for page that does not exist',function(done){
    	agent
    	.get('/wiki/bluebs/similar')
    	.expect(404, done);
    });
    it('responds with 200 for similar page',function(done){
    	agent
    	.get('/wiki/Hello_there/similar')
    	.expect(200, done);
    });
  });

  describe('POST /wiki', function () {
  	afterEach(function(done) {
      User.remove({name : "winnie"})
      .then(function(){
        done();
      })
      .then(null, function(err){
        console.error(err);
        done();
      });
    });
    afterEach(function(done) {
      Page.remove({title : "Hello there"})
      .then(function(){
        done();
      })
      .then(null, function(err){
        console.error(err);
        done();
      });
    });

    it('responds with 302',function(done){
    	agent
		.post('/wiki')
		.send({
			name: 'winnie',
			email: 'winnie@pooh.com',
            title: "Hello there",
            content: "This is a page",
            tags: '1, 2, 3',
            status: 'open'
        })
        .expect(302, done);
    });
    it('creates a page in the database', function(done) {
    	agent
    	.post('/wiki')
		.send({
			name: 'winnie',
			email: 'winnie@pooh.com',
            title: "Hello there",
            content: "This is a page",
            tags: '1, 2, 3',
            status: 'open'
        })
        .expect(function(res) {
        	// console.log(res.headers);
          	expect(res.headers.location).to.eql('/wiki/Hello_there');
        })
        .expect(302, done);
        


    	// .expect(Page.find({title : "Hello there"})
    	// 	.exec()
    	// 	.then(function(promise) {
    	// 		return promise;
    	// 	}), done);
    });
  });
});