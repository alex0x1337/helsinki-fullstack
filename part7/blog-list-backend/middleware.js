
const jwt = require('jsonwebtoken')

const User = require('./models/user')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

const tokenExtractor = (req, res, next) => {
    req.token = getTokenFrom(req)
    next()
}

const userExtractor = async (req, res, next) => {
    if(req.token) {
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        if (decodedToken) {
            req.user = await User.findById(decodedToken.id)
        }
    }
    next()
}


module.exports = { tokenExtractor, userExtractor }