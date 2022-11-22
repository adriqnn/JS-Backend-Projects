const Trip = require('../models/Trip');

async function getAll(){
     return Trip.find({}).lean();
};

async function getById(id){
    return Trip.findById(id).lean();
};

async function create(trip){
    return await Trip.create(trip);
};

async function update(id, model){
    const existing = await Trip.findById(id);
    existing.startPoint = model.startPoint;
    existing.endPoint = model.endPoint;
    existing.date = model.date;
    existing.time = model.time;
    existing.carImage = model.carImage;
    existing.carBrand = model.carBrand;
    existing.seats = Number(model.seats);
    existing.price = Number(model.price);
    existing.description = model.description;
    await existing.save();
};

async function deleteById(id){
    await Trip.findByIdAndRemove(id);
};

async function buddyTrip(modelId, userId){
    const trip = await Trip.findById(modelId);
    trip.buddies.push(userId);
    trip.seats = trip.seats -1;
    await trip.save();
};

async function getBuddies(id){
    const trip = await Trip.findById(id).populate('buddies');
    const buddies = trip.buddies.map(e => e.email).join(', ');
    return buddies;
};

async function getOwner(tripId){
    const trip = await Trip.findById(tripId).populate('owner');
    return trip.owner.email;
};

async function getUserTrips(userId){
    console.log(userId)
    return await Trip.find({owner: userId}).lean();
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById,
    buddyTrip,
    getBuddies,
    getOwner,
    getUserTrips
};