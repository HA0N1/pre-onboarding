import { CustomError } from '../utils/customError.js';

export default function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof CustomError) {
    return res.status(err.status).json({
      status: 'error',
      code: err.status,
      message: err.message,
    });
  }

  res.status(400).json({
    status: 'error',
    code: err.status,
    message: err.message,
  });
}
