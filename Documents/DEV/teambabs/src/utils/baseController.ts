
const ob  = {
	200 : "SUCCESS",
	201 : "CREATED",
	204 : "NO_CONTENT ",
	400 : "BAD_REQUEST",
	401 : "UNAUTHORIZED",
	403 : "FORBIDDEN",
	404 : "NOT_FOUND",
	422 : "UNPROCESSABLE_ENTITY",
	500 : "INTERNAL_ERROR",
}

class BaseController {
  public static sucess(res, data = [], message = 'success', httpStatus = 200) {
    res.status(httpStatus).send({
      message,
      data,
    });
  }

  public static error(res, error) {
    console.log(error.err)
    res.status(error.code || 400).json({
      status: 'error',
      message: ob[error.code],
    });
  }
}

export default BaseController
