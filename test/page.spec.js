var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);
var expect = require('chai').expect;

var models = require('../models');
var Page = models.Page;

describe('Page model', function() {

  describe('Virtuals', function() {
    var testPage;
    beforeEach(function() {
      testPage = new Page();
      testPage.urlTitle = "Hello_there";
      testPage.content = "Hello there";
    });
    describe('route', function() {
      it('returns the url_name prepended by "/wiki/"',function(){
        expect(testPage.route).to.equal("/wiki/Hello_there");
      });
    });
    describe('renderedContent', function () {
      it('converts the markdown-formatted content into HTML', function(){
        expect(testPage.renderedContent).to.equal("<p>Hello there</p>\n");
      });
    });
  });

  describe('Statics', function() {
    var testPage;
    beforeEach(function(done) {
      testPage = new Page();
      testPage.title="H";
      testPage.content="T";
      testPage.tags = ['tag1', 'tag2', 'bananas'];
      testPage.save().then(function(){
        done();
      }).then(null, function(err){
        console.error(err);
        done();
      });
    });
    afterEach(function(done) {
      Page.remove({title : "H"})
      .then(function(){
        done();
      })
      .then(null, function(err){
        console.error(err);
        done();
      });
    });
    describe('findByTag', function() {
      it('gets pages with the search tag', function(done) {
        Page.findByTag('bananas')
        .then(function (pages) {
          // console.log(pages);
          expect(pages).to.have.lengthOf(1);
          done();
      })
      .then(null, done);
    });

      it('does not get pages without the search tag',function(done){
      Page.findByTag('jkasjdlfasdklfjsfdasfasdfsadfsasdf')
          .then(function (pages) {
            // console.log(pages);
            expect(pages).to.have.lengthOf(0);
            done();
        })
        .then(null, done);
      });
    });
  });

  describe('Methods', function() {
    var page1, page2, page3;
    beforeEach(function(done) {
      page1 = new Page();
      page1.tags = ['tag1', 'tag2', 'bananas'];
      page1.content = "kjjkjasldf";
      page1.title = "Hello";
      page1.save().then(null, function(err){
        console.error(err);
        done();
      });
      page2 = new Page();
      page2.tags = ['tag1'];
      page2.content = "kjjkjasldf";
      page2.title = "Hello";
      page2.save().then(null, function(err){
        console.error(err);
        done();
      });
      page3 = new Page();
      page3.tags = ['qwerty'];
      page3.content = "kjjkjasldf";
      page3.title = "Hello";
      page3.save().then(function(){
        done();
      }).then(null, function(err){
        console.error(err);
        done();
      });
    });
    afterEach(function(done) {
      Page.remove({title : "Hello"})
      .then(function(){
        done();
      })
      .then(null, function(err){
        console.error(err);
        done();
      });
    });
    describe('findSimilar', function() {
      it('never gets itself',function(done){
        page1.findSimilar().then(function(pages) {
          expect(pages[0]._id.toString()).to.not.equal(page1._id.toString());
          done();
        })
        .then(null, done);
      });

      it('gets other pages with any common tags',function(done){
        page1.findSimilar().then(function(pages) {
          expect(pages[0]._id.toString()).to.equal(page2._id.toString());
          done();
        })
        .then(null, done);
      });
      it('does not get other pages without any common tags', function(done) {
        page1.findSimilar().then(function(pages) {
          expect(pages[0]._id.toString()).to.not.equal(page3._id.toString());
          done();
        })
        .then(null, done);
      });
    });
  });

  describe('Validations', function() {
    var page1, page2, page3;
    beforeEach(function() {
      page1 = new Page();
      page1.tags = ['tag1', 'tag2', 'bananas'];
      page1.content = "kjjkjasldf";
      // page1.title = "Hello";

      page2 = new Page();
      page2.tags = ['tag1'];
      // page2.content = "kjjkjasldf";
      page2.title = "Hello";

      page3 = new Page();
      page3.status = 'dkakjd';
      page3.tags = ['qwerty'];
      page3.content = "kjjkjasldf";
      page3.title = "Hello";

    });
    it('errors without title', function(done){
      page1.validate(function(err) {
        expect(err.errors).to.have.property('title');
        done();
      });
    });
    it('errors without content', function(done){
      page2.validate(function(err) {
        expect(err.errors).to.have.property('content');
        done();
      });
    });
    it('errors given an invalid status', function(done){
      page3.validate(function(err) {
        expect(err.errors).to.have.property('status');
        done();
      });
    });
  });

  describe('Hooks', function() {
    var page1;
    beforeEach(function() {
      page1 = new Page();
      page1.content = "kjjkjasldf";
      page1.title = "Hello There";
    });
    it('it sets urlTitle based on title before validating',function(done){
      page1.validate(function(err){
        expect(page1.urlTitle).to.equal("Hello_There");
        done();
      });
    });
  });

});





















