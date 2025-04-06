import express from "express";

const sendResponseJson = <T>(
  res: express.Response,
  status: number,
  message: string,
  success: boolean,
  _data?: T
): express.Response => {
  return res.status(status).json({
    message,
    success,
    data: _data,
  });
};

export default sendResponseJson;
