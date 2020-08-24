import { Router } from 'express'
import multer from 'multer'

import CreateUser from '../services/CreateUser'
import UpdateUserAvatar from '../services/UpdateUserAvatar'

import ensureAuthenticated from '../middlewares/ensureAuthenticated'

import uploadConfig from '../config/upload'

const router = Router()

const upload = multer(uploadConfig)

router.post('/', async (request, response) => {
  const { name, email, password } = request.body

  const createUser = new CreateUser()

  const user = await createUser.execute({ name, email, password })

  delete user.password

  return response.json(user)
})

router.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatar = new UpdateUserAvatar()

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      filename: request.file.filename,
    })

    delete user.password

    return response.json(user)
  },
)

export default router
