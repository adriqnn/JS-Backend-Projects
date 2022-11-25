const Course = require("../models/Course");

async function getAll(){
    return Course.find({}).lean();
};

async function getById(id){
    return Course.findById(id).lean();
};

async function create(course){
    const title = course.title;
    const existing = await Course.findOne({title}).collation({locale: 'en', strength: 2});
    if(existing){
        throw new Error('Course already in the DB');
    };
    return await Course.create(course);
};

async function update(id, course){
    const existing = await Course.findById(id);
    existing.title = course.title;
    existing.description = course.description;
    existing.duration = course.duration;
    existing.imageUrl = course.imageUrl;
    await existing.save();
};

async function deleteById(id){
    await Course.findByIdAndRemove(id);
};

async function enrollInCourse(courseId, userId){
    const course = await Course.findById(courseId);
    course.students.push(userId);
    await course.save();
};

async function search(query){
    return Course.find({title: search}).collation({locale: 'en', strength: 2}).sort({createdAt: 1}).lean();
};

async function getByUserCourses(userId){

};

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById,
    enrollInCourse,
    getByUserCourses,
    search
}