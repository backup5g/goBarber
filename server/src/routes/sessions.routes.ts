import { Router } from 'express'

import AuthenticateUser from '../services/AuthenticateUser'

const router = Router()

router.post('/', async (request, response) => {
  const { email, password } = request.body

  const authenticateUser = new AuthenticateUser()

  const { user, token } = await authenticateUser.execute({ email, password })

  delete user.password

  return response.json({ user, token })
})

export default router
