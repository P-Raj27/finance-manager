export const responseMessages = Object.freeze({
  ok: { statusCode: 200, message: "ok" },
  create: { statusCode: 201, message: "requested entity is created" },
  update: { statusCode: 200, message: "successfully modified" },
  notFound: { statusCode: 404, message: "not found" },
  badRequest: { statusCode: 400, message: "bad request" },
  forbidden: { statusCode: 403, message: "Access Denied" },
  serverError: { statusCode: 500, message: "Internal server error" },
  delete: { statusCode: 204, message: "requested entity is deleted" },
  archive: { statusCode: 204, message: "requested entity is archived" },
  externalServerError: {
    statusCode: 503,
    message: "The external server used on this request is unavailable",
  },
  redirect: { statusCode: 301, message: "successfully redirected" },
  conflict: { statusCode: 409, message: "resource already exists" },
} as const);

type ResponseMessageKey = keyof typeof responseMessages;

interface ResponseState {
  statusCode: string | number;
  generatedAt: string | number;
  data: any[];
  error: any[];
  message: string;
}

export const ResponsePrototype = () => {
  const state: ResponseState = {
    statusCode: "",
    generatedAt: "",
    data: [],
    error: [],
    message: "",
  };

  const setSuccessResponse = (type: ResponseMessageKey, data: any = "") => {
    state.statusCode = responseMessages[type].statusCode;
    state.message = responseMessages[type].message;
    state.generatedAt = Date.now();
    if (data) {
      state.data = data;
    }
    return state;
  };

  const setErrorResponse = (type: ResponseMessageKey, error: any = "", data?: any) => {
    state.statusCode = responseMessages[type].statusCode;
    state.message = responseMessages[type].message;
    state.generatedAt = Date.now();
    if (error) {
      state.error = error;
    }
    if (data) {
      state.data = data;
    }
    return state;
  };

  const setValidationResponse = (message: string, error: any = "validationError", data?: any) => {
    state.statusCode = responseMessages.badRequest.statusCode;
    state.message = message;
    state.generatedAt = Date.now();
    if (error) {
      state.error = error;
    }
    if (data) {
      state.data = data;
    }
    return state;
  };

  return {
    setSuccessResponse,
    setErrorResponse,
    setValidationResponse,
  };
};
