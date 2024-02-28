import { Response as ExpressResponse } from 'express';

interface IModifiedResponse {
  status: number;
  message: string;
  data: any;
  success: boolean;
}

interface IMapParams {
  response: any;
  res: ExpressResponse;
}

export class Response {
  static map({ res, response }: IMapParams) {
    const modifiedResponse: IModifiedResponse = {
      status: 200,
      message: 'Success',
      data: null,
      success: true,
    };

    switch (typeof response) {
      case 'object':
        if (Array.isArray(response)) {
          modifiedResponse['data'] = response;
          break;
        }

        if (response.status) {
          modifiedResponse['status'] = response.status;
          delete response.status;
        }

        if (response.message) {
          modifiedResponse['message'] = response.message;
          delete response.message;
        }

        if (response.data) {
          modifiedResponse['data'] = response.data;
        } else {
          modifiedResponse['data'] = response;
        }

        if (JSON.stringify(modifiedResponse.data) == '{}')
          modifiedResponse['data'] = null;

        break;
      case 'string':
        modifiedResponse['message'] = response;
        break;
      default:
        modifiedResponse['data'] = response;
        break;
    }

    return res.status(modifiedResponse.status).send({
      status: modifiedResponse.status,
      message: modifiedResponse.message,
      data: modifiedResponse.data,
      success: modifiedResponse.status >= 200 && modifiedResponse.status < 300,
    });
  }
}
