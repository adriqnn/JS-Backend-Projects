const Housing = require("../models/Housing");
const User = require("../models/User");

async function getAll(){
    return Housing.find({}).lean();
};

async function getById(id){
    return Housing.findById(id).lean();
};

async function create(housing){
    return await Housing.create(housing);
};

async function update(id, housing){
    const existing = await Housing.findById(id);
    existing.name = housing.name;
    existing.type = housing.type;
    existing.year = Number(housing.year);
    existing.city = housing.city;
    existing.homeImage = housing.homeImage;
    existing.propertyDescription = housing.propertyDescription;
    existing.availablePieces = Number(housing.availablePieces);
    await existing.save();
};

async function deleteById(id){
    await Housing.findByIdAndRemove(id);
};

async function rentHousing(housingId, userId){
    const housing = await Housing.findById(housingId);
    housing.rentees.push(userId);
    housing.availablePieces = housing.availablePieces -1;
    await housing.save();
};

async function getTenantsByHousingId(housingId){
    return Housing.findById(housingId).populate('rentees');
}

async function getHousingWithSearch(query){
    const housing = await getAll();
    return housing.filter(e => e.type.toString().toLowerCase() == query.toLowerCase());
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById,
    rentHousing,
    getTenantsByHousingId,
    getHousingWithSearch
};