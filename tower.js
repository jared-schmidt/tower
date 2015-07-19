var Scores = new Mongo.Collection('scores');

if (Meteor.isClient) {
    Template.leaderboard.helpers({
        players: function(){
            Meteor.subscribe('scores')
            return Scores.find({});
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });

    Meteor.publish('scores', function(){
        return Scores.find({score: {$gt: 0}}, {sort: {level: -1, score: -1}, limit: 10});
    });

    Meteor.methods({
        'addScore': function(score) {
            score.created = new Date();
            Scores.insert(score);
        }
    });
}
