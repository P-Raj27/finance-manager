import { responseMessages, ResponsePrototype } from "./response-prototype.ts";

const internalServerError = (msg = "") => {
  return {
    statusCode: responseMessages.serverError.statusCode,
    body: JSON.stringify(ResponsePrototype().setErrorResponse("serverError", msg)),
  };
};

const externalServerError = (msg = "") => {
  return {
    statusCode: responseMessages.externalServerError.statusCode,
    body: JSON.stringify(ResponsePrototype().setErrorResponse("externalServerError", msg)),
  };
};

const badRequest = (msg = "") => {
  return {
    statusCode: responseMessages.badRequest.statusCode,
    body: JSON.stringify(ResponsePrototype().setErrorResponse("badRequest", msg)),
  };
};
const resourceNotFound = () => {
  return {
    statusCode: responseMessages.notFound.statusCode,
    body: JSON.stringify(ResponsePrototype().setErrorResponse("notFound", ["Requested resource not found"])),
  };
};
const createResponse = (data: any) => {
  return {
    statusCode: responseMessages.create.statusCode,
    body: JSON.stringify(ResponsePrototype().setSuccessResponse("create", data)),
  };
};

const okResponse = (data: any) => {
  return {
    statusCode: responseMessages.ok.statusCode,
    body: JSON.stringify(ResponsePrototype().setSuccessResponse("ok", data)),
  };
};

const deleteResponse = (data: any) => {
  return {
    statusCode: responseMessages.delete.statusCode,
    body: JSON.stringify(ResponsePrototype().setSuccessResponse("delete", data)),
  };
};

const validationErrors = (errorList: any, data?: any) => {
  return {
    statusCode: responseMessages.badRequest.statusCode,
    body: JSON.stringify(ResponsePrototype().setErrorResponse("badRequest", errorList, data)),
  };
};

const forbiddenResponse = () => {
  return {
    statusCode: responseMessages.forbidden.statusCode,
    body: JSON.stringify(
      ResponsePrototype().setErrorResponse("forbidden", "You do not have permissions to access this resource"),
    ),
  };
};

const conflictResponse = (msg: string) => {
  return {
    statusCode: responseMessages.conflict.statusCode,
    body: JSON.stringify(ResponsePrototype().setErrorResponse("conflict", msg)),
  };
};

export {
  internalServerError,
  validationErrors,
  resourceNotFound,
  createResponse,
  okResponse,
  deleteResponse,
  forbiddenResponse,
  externalServerError,
  conflictResponse,
  badRequest,
};
