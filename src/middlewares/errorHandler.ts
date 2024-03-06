import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import { ErrorHandler } from '../entities/error.entity'

function errorHandling(
  err: ErrorHandler | Prisma.PrismaClientKnownRequestError,
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
          'Email has been used by another user, a new user cannot be created with this email',
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
  } else {
    res.status(err.statusCode).json({ ...err })
  }
}

export default errorHandling
