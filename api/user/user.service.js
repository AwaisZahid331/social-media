const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
  query,
  getById,
  getByUsername,
  remove,
  update,
  add,
}

async function query(filterBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy)
    // const criteria = {}

    const collection = await dbService.getCollection('user')
    var users = await collection.find(criteria).toArray()

    users = users.map((user) => {
      delete user.password
      return user
    })
    return users
  } catch (err) {
    logger.error('cannot find users', err)
    throw err
  }
}

async function getById(userId) {
  try {
    const collection = await dbService.getCollection('user')
    const user = await collection.findOne({ _id: ObjectId(userId) })
    delete user.password
    return user
  } catch (err) {
    logger.error(`while finding user ${userId}`, err)
    throw err
  }
}
async function getByUsername(username) {
  try {
    const collection = await dbService.getCollection('user')
    const user = await collection.findOne({ username })
    return user
  } catch (err) {
    logger.error(`while finding user ${username}`, err)
    throw err
  }
}

async function remove(userId) {
  try {
    const collection = await dbService.getCollection('user')
    await collection.deleteOne({ _id: ObjectId(userId) })
  } catch (err) {
    logger.error(`cannot remove user ${userId}`, err)
    throw err
  }
}

async function update(user) {
  try {
    // peek only updatable fields!
    const userToSave = {
      ...user,
      _id: ObjectId(user._id),
    }
    const collection = await dbService.getCollection('user')
    await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
    return userToSave
  } catch (err) {
    logger.error(`cannot update user ${user._id}`, err)
    throw err
  }
}

async function add(user) {
  try {
    // peek only updatable fields!
    const userToAdd = {
      username: user.username,
      password: user.password,
      profession: null,
      fullname: user.fullname,
      isAdmin: user.isAdmin || false,
      age: null,
      createdAt: new Date().getTime(),
      connections: [],
      following: [],
      followers: [],
      gender: null,
      phone: null,
      birthDate: null,
      email: null,
      bg: '',
      position: null,
      imgUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVe0cFaZ9e5Hm9X-tdWRLSvoZqg2bjemBABA&usqp=CAU',
    }
    const collection = await dbService.getCollection('user')
    await collection.insertOne(userToAdd)
    return userToAdd
  } catch (err) {
    logger.error('cannot insert user', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}

  if (filterBy.txt) {
    const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
    criteria.$or = [
      {
        username: txtCriteria,
      },
      {
        fullname: txtCriteria,
      },
    ]
  }

  // filter by position - if exists

  // if (filterBy.position) {
  //   criteria.position = { $exists: true }
  // }
  if (filterBy.position) {
    criteria.$and = [
      { 'position.lat': { $exists: true } },
      { 'position.lng': { $exists: true } },
    ]
  }

  return criteria
}
