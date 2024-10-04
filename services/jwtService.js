import { sign, verify } from 'jsonwebtoken'

const createTokens = (user) => {
  const accessToken = sign(
    { username: user.userName, id: user._id },
    process.env.TOKEN_SECRET,
    { expiresIn: '24h' }
  )

  return accessToken
}

const validateToken = (req, res, next) => {
  let cookies = {}

  const cookiesArray = req.headers.cookie?.split(';')
  cookiesArray?.forEach((cookie) => {
    const [key, value] = cookie.trim().split('=')
    cookies[key] = value
  })

  // get The "access-token" value:
  const accessToken = cookies['access-token']

  if (!accessToken)
    return res.status(400).json({ error: 'User not Authenticated!' })

  try {
    const validToken = verify(accessToken, process.env.TOKEN_SECRET)
    if (validToken) {
      req.authenticated = true
      return next()
    }
  } catch (err) {
    return res.status(400).json({ error: err })
  }
}

export const jwtService = {
  createTokens,
  validateToken,
}
