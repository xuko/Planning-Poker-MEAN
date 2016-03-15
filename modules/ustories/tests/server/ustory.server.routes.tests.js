'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Ustory = mongoose.model('Ustory'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, ustory;

/**
 * Ustory routes tests
 */
describe('Ustory CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Ustory
    user.save(function () {
      ustory = {
        name: 'Ustory name'
      };

      done();
    });
  });

  it('should be able to save a Ustory if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Ustory
        agent.post('/api/ustories')
          .send(ustory)
          .expect(200)
          .end(function (ustorySaveErr, ustorySaveRes) {
            // Handle Ustory save error
            if (ustorySaveErr) {
              return done(ustorySaveErr);
            }

            // Get a list of Ustories
            agent.get('/api/ustories')
              .end(function (ustorysGetErr, ustorysGetRes) {
                // Handle Ustory save error
                if (ustorysGetErr) {
                  return done(ustorysGetErr);
                }

                // Get Ustories list
                var ustories = ustorysGetRes.body;

                // Set assertions
                (ustories[0].user._id).should.equal(userId);
                (ustories[0].name).should.match('Ustory name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Ustory if not logged in', function (done) {
    agent.post('/api/ustories')
      .send(ustory)
      .expect(403)
      .end(function (ustorySaveErr, ustorySaveRes) {
        // Call the assertion callback
        done(ustorySaveErr);
      });
  });

  it('should not be able to save an Ustory if no name is provided', function (done) {
    // Invalidate name field
    ustory.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Ustory
        agent.post('/api/ustories')
          .send(ustory)
          .expect(400)
          .end(function (ustorySaveErr, ustorySaveRes) {
            // Set message assertion
            (ustorySaveRes.body.message).should.match('Please fill Ustory name');

            // Handle Ustory save error
            done(ustorySaveErr);
          });
      });
  });

  it('should be able to update an Ustory if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Ustory
        agent.post('/api/ustories')
          .send(ustory)
          .expect(200)
          .end(function (ustorySaveErr, ustorySaveRes) {
            // Handle Ustory save error
            if (ustorySaveErr) {
              return done(ustorySaveErr);
            }

            // Update Ustory name
            ustory.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Ustory
            agent.put('/api/ustories/' + ustorySaveRes.body._id)
              .send(ustory)
              .expect(200)
              .end(function (ustoryUpdateErr, ustoryUpdateRes) {
                // Handle Ustory update error
                if (ustoryUpdateErr) {
                  return done(ustoryUpdateErr);
                }

                // Set assertions
                (ustoryUpdateRes.body._id).should.equal(ustorySaveRes.body._id);
                (ustoryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Ustories if not signed in', function (done) {
    // Create new Ustory model instance
    var ustoryObj = new Ustory(ustory);

    // Save the ustory
    ustoryObj.save(function () {
      // Request Ustories
      request(app).get('/api/ustories')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Ustory if not signed in', function (done) {
    // Create new Ustory model instance
    var ustoryObj = new Ustory(ustory);

    // Save the Ustory
    ustoryObj.save(function () {
      request(app).get('/api/ustories/' + ustoryObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', ustory.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Ustory with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/ustories/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Ustory is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Ustory which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Ustory
    request(app).get('/api/ustories/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Ustory with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Ustory if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Ustory
        agent.post('/api/ustories')
          .send(ustory)
          .expect(200)
          .end(function (ustorySaveErr, ustorySaveRes) {
            // Handle Ustory save error
            if (ustorySaveErr) {
              return done(ustorySaveErr);
            }

            // Delete an existing Ustory
            agent.delete('/api/ustories/' + ustorySaveRes.body._id)
              .send(ustory)
              .expect(200)
              .end(function (ustoryDeleteErr, ustoryDeleteRes) {
                // Handle ustory error error
                if (ustoryDeleteErr) {
                  return done(ustoryDeleteErr);
                }

                // Set assertions
                (ustoryDeleteRes.body._id).should.equal(ustorySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Ustory if not signed in', function (done) {
    // Set Ustory user
    ustory.user = user;

    // Create new Ustory model instance
    var ustoryObj = new Ustory(ustory);

    // Save the Ustory
    ustoryObj.save(function () {
      // Try deleting Ustory
      request(app).delete('/api/ustories/' + ustoryObj._id)
        .expect(403)
        .end(function (ustoryDeleteErr, ustoryDeleteRes) {
          // Set message assertion
          (ustoryDeleteRes.body.message).should.match('User is not authorized');

          // Handle Ustory error error
          done(ustoryDeleteErr);
        });

    });
  });

  it('should be able to get a single Ustory that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Ustory
          agent.post('/api/ustories')
            .send(ustory)
            .expect(200)
            .end(function (ustorySaveErr, ustorySaveRes) {
              // Handle Ustory save error
              if (ustorySaveErr) {
                return done(ustorySaveErr);
              }

              // Set assertions on new Ustory
              (ustorySaveRes.body.name).should.equal(ustory.name);
              should.exist(ustorySaveRes.body.user);
              should.equal(ustorySaveRes.body.user._id, orphanId);

              // force the Ustory to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Ustory
                    agent.get('/api/ustories/' + ustorySaveRes.body._id)
                      .expect(200)
                      .end(function (ustoryInfoErr, ustoryInfoRes) {
                        // Handle Ustory error
                        if (ustoryInfoErr) {
                          return done(ustoryInfoErr);
                        }

                        // Set assertions
                        (ustoryInfoRes.body._id).should.equal(ustorySaveRes.body._id);
                        (ustoryInfoRes.body.name).should.equal(ustory.name);
                        should.equal(ustoryInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Ustory.remove().exec(done);
    });
  });
});
