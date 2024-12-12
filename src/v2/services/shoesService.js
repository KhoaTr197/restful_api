const DB = require('./database');

const services = {};

//SHOES SERVICE
services.getAllShoes = async () => {
  const db = await DB.connect();
  const shoes = db.collection('shoes');

  const allShoes = await shoes.find().toArray();

  return allShoes;
};

services.searchShoes = async (
  limit,
  skip,
  searchQuery
) => {
  const db = await DB.connect();
  const shoes = db.collection('shoes');

  // shoes.createIndex({ 
  //   name: "text",
  //   description: "text"
  // });

  const foundedShoes = shoes
    .find({ $text: { $search: searchQuery } })
    .limit(limit ? limit : 0)
    .skip(skip ? skip : 0)
    .toArray();

  return foundedShoes;
}

services.getShoeById = async (id) => {
  const db = await DB.connect();
  const shoes = db.collection('shoes');

  const query = { id: Number(id) };
  const foundedShoe = await shoes.findOne(query);

  return foundedShoe;
};

services.createNewShoe = async (newShoe) => {
  const db = await DB.connect();
  const brands = db.collection('brands');
  const brandImages = db.collection('brand_images');
  const shoes = db.collection('shoes');

  const brandData = await brands.findOne({ name: newShoe.brand });
  const brandImagesData = await brandImages.findOne({ brand_id: brandData.id });
  const latestShoe = await shoes.find().sort({ id: -1 }).limit(1).toArray();

  const result = await shoes.insertOne({
    ...newShoe,
    id: latestShoe[0].id + 1,
    brand: {
      id: brandData.id,
      name: brandData.name,
      image: brandImagesData.filename
    }
  });

  return result;
};

module.exports = services;