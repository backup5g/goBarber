import { getRepository } from 'typeorm'
import path from 'path'
import fs from 'fs'

import User from '../models/User'

import uploadConfig from '../config/upload'

import AppError from '../errors/AppError'

interface Request {
  user_id: string
  filename: string
}

class UpdateUserAvatar {
  public async execute({ user_id, filename }: Request): Promise<User> {
    const repository = getRepository(User)

    const user = await repository.findOne(user_id)

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401)
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar)
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath)

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath)
      }
    }

    user.avatar = filename

    await repository.save(user)

    return user
  }
}

export default UpdateUserAvatar
