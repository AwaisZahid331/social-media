const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const utilService = require('../../services/util.service')

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
  getLength,
}

async function query(filterBy) {
  try {
    const collection = await dbService.getCollection('post')

    let sort = {
      createdAt: -1,
    }

    if (!Object.keys(filterBy).length) {
      var posts = await collection.find({}).sort(sort).toArray()
      return posts
    } else {
      const criteria = _buildCriteria(filterBy)

      let limit = 5
      let endIndex = 0

      if (filterBy.page) {
        const page = filterBy.page
        endIndex = page * limit
      }

      if (filterBy.sort) {
        sort.createdAt = filterBy.sort
      }

      if (filterBy.position) {
        // load all posts with position
        limit = Infinity
        endIndex = 0
      }

      var posts = await collection
        .find(criteria)
        .sort(sort)
        .limit(limit)
        .skip(endIndex)
        .toArray()
      return posts
    }
  } catch (err) {
    logger.error('cannot find posts', err)
    throw err
  }
}
async function getLength(filterBy) {
  try {
    const criteria = _buildCriteria(filterBy)

    const collection = await dbService.getCollection('post')

    var posts = await collection
      .find(criteria)
      .sort({ createdAt: -1 })
      .toArray()
    return posts.length
  } catch (err) {
    logger.error('cannot find posts', err)
    throw err
  }
}

async function getById(postId) {
  try {
    const collection = await dbService.getCollection('post')
    const post = collection.findOne({ _id: ObjectId(postId) })
    return post
  } catch (err) {
    logger.error(`while finding posts ${postId}`, err)
    throw err
  }
}

async function remove(postId) {
  try {
    const collection = await dbService.getCollection('post')
    await collection.deleteOne({ _id: ObjectId(postId) })
    return postId
  } catch (err) {
    logger.error(`cannot remove posts ${postId}`, err)
    throw err
  }
}

async function add(post) {
  const {
    body,
    imgBodyUrl,
    title,
    userId,
    position,
    videoBodyUrl,
    fullname,
    link,
  } = post
  try {
    const postToAdd = {
      userId: userId,
      title,
      body,
      style: null,
      reactions: [],
      createdAt: new Date().getTime(),
      imgBodyUrl,
      shares: [],
      comments: [],
      position: position || null,
      videoBodyUrl,
      fullname,
      link,
    }

    const collection = await dbService.getCollection('post')
    await collection.insertOne(postToAdd)
    return postToAdd
  } catch (err) {
    logger.error('cannot insert posts', err)
    throw err
  }
}

async function update(post) {
  try {
    var id = ObjectId(post._id)
    delete post._id
    const collection = await dbService.getCollection('post')
    await collection.updateOne({ _id: id }, { $set: { ...post } })
    const addedPost = { ...post, _id: id }
    return addedPost
  } catch (err) {
    logger.error(`cannot update post ${post._id}`, err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}

  // by txt
  // if (filterBy.txt) {
  //   const regex = new RegExp(filterBy.txt, 'i')
  //   criteria.body = { $regex: regex }
  // }
  if (filterBy.txt) {
    const regex = new RegExp(filterBy.txt, 'i')
    criteria.$or = [
      { body: { $regex: regex } },
      { fullname: { $regex: regex } },
      { title: { $regex: regex } },
    ]
  }

  if (filterBy.userId) {
    criteria.userId = filterBy.userId
  }

  if (filterBy._id) {
    criteria._id = ObjectId(filterBy._id)
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

  if (filterBy.inStock) {
    criteria.inStock = { $eq: JSON.parse(filterBy.inStock) }
  }

  // // filter by labels
  // if (filterBy.labels?.length) {
  //   criteria.labels = { $in: filterBy.labels }
  // }

  return criteria
}
