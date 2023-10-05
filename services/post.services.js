const { dataSource } = require('../connect');
const PostEntity = require('../model/Post').PostEntity;

function findAll() {
  const result = dataSource
  .getRepository(PostEntity)
  .createQueryBuilder("post")
  .leftJoinAndSelect("post.categories", "category")
  .getMany()

  return result;
}

function findOne(id) {
  const result = dataSource
  .getRepository(PostEntity)
  .createQueryBuilder('post')
  .leftJoinAndSelect("post.categories", "category")
  .where("post.id = :id", {id: id})
  .getOne()

  return result;
}

function create(data) {

  console.log(">>>", data);
  const result = dataSource
  .getRepository(PostEntity)
  .save(data)
  .catch((error) => console.log("Problem in saving post", error))

  return result;
}
// Create json
// {
//  "title": "my second post",
//  "text": "my second post test",
//  "categories": [
//      { "id": 29 },
//      { "id": 31 }
//   ]
// }

function updatePost(data) {
  const result = dataSource
  .getRepository(PostEntity)
  .createQueryBuilder()
  .update(PostEntity)
  .set({
    title: data.title,
    text: data.text
  })
  .where("id = :id", {id: data.id})
  .execute()

  return result;
}

 async function updateCategory(data) {

  const actualRealationsShips = await dataSource
  .getRepository(PostEntity)
  .createQueryBuilder()
  .relation(PostEntity, "categories")
  .of(data.id)
  .loadMany()

console.log(">>>", actualRealationsShips);
const result = await dataSource
.getRepository(PostEntity)
.createQueryBuilder()
.relation(PostEntity, "categories")
.of(data.id)
.addAndRemove(data.categories, actualRealationsShips)
.catch((error) => console.log("Cannot update categories", error));
console.log(">>>", result);
return result;
}

module.exports = { findAll, findOne, create, updatePost, updateCategory }
