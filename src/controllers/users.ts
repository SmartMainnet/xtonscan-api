import { Request, Response } from 'express'

import { UsersModel } from '../database/models/index.js'
import { API } from '../classes/index.js'
import { IAPI } from '../types/index.js'

export const createUser = async (
  req: Request,
  res: Response
): Promise<Response<IAPI>> => {
  try {
    const user = req.body

    const userFromDb = await UsersModel.findOne({ user_id: user.id })
    console.log('userFromDb: ', userFromDb)

    if (!userFromDb) {
      const newUser = await UsersModel.create({
        user_id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
      })
      return res.json(API.result(newUser))
    }

    return res.json(
      API.error({
        message: 'user already exists',
      })
    )
  } catch (e: any) {
    return res.json(API.error(e))
  }
}

export const getUsers = async (
  req: Request,
  res: Response
): Promise<Response<IAPI>> => {
  try {
    const users = await UsersModel.find()
    return res.json(API.result(users))
  } catch (e: any) {
    return res.json(API.error(e))
  }
}

export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response<IAPI>> => {
  try {
    const { id } = req.body

    const user = await UsersModel.findOne({ id })

    if (!user) {
      return res.json(
        API.error({
          message: 'user not found',
        })
      )
    }

    return res.json(API.result(user))
  } catch (e: any) {
    return res.json(API.error(e))
  }
}

export const getUserByUserId = async (
  req: Request,
  res: Response
): Promise<Response<IAPI>> => {
  try {
    const { user_id } = req.body

    const user = await UsersModel.findOne({ user_id })

    if (!user) {
      return res.json(
        API.error({
          message: 'user not found',
        })
      )
    }

    return res.json(API.result(user))
  } catch (e: any) {
    return res.json(API.error(e))
  }
}
