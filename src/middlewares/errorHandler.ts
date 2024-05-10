import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import { ErrorHandler } from '../entities/error.entity'
import { ZodError } from 'zod'

function errorHandling(
  err: ErrorHandler | Prisma.PrismaClientKnownRequestError | ZodError,
  _: Request,
  res: Response,
  __: NextFunction
) {
  // This console.log, for error handler purpose
  console.log(err)

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(400).json({
        ...err,
        message:
          'Email/username has been used by another user, a new user cannot be created with this email/username',
      })
    } else if (err.code === 'P2025') {
      res.status(404).json({
        ...err,
        message: 'Data not found',
      })
    } else if (err.code === 'P2021') {
      res
        .status(500)
        .json({ ...err, message: 'Server database error, system database has not been migrated' })
    } else {
      res.status(500).json({ ...err })
    }
  } else if (err instanceof ZodError) {
    res
      .status(400)
      .json({ ...err, message: 'Validation error, please send the data in the correct data type' })
  } else {
    res.status(err.statusCode).json({ ...err })
  }
}

export default errorHandling
