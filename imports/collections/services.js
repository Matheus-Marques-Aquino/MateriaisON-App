import { Mongo } from 'meteor/mongo';
Meteor.methods({
    'service.popularity': function(_id){
        let service = Service.findOne({'_id': _id});
        if (!service.popularity){ service.popularity = []; }
        if (!service.popularity.includes(Meteor.userId())){ service.popularity.push(Meteor.userId()); }
        Service.update({'_id': _id}, {$set: {'popularity': service.popularity}})
        return;          
    }
});
export const Services = new Mongo.Collection('services')