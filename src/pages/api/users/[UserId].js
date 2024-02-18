import User from "../../../models/User";
import dbConnect from "../../../services/db";
import joi from "joi";
import universalFunctions from "../../../utils/universalFunctions";
import responseMessages from "../../../resources/response.json";
import Boom from "boom";

dbConnect();

export default async function handler(req, res) {
  const { method } = req;
  const { UserId } = req.query;
  switch (method) {
    case "GET":
      try {
        let userData = await User.findOne({ _id: UserId });
        if (!userData) {
          throw Boom.notFound(responseMessages.USER_NOT_FOUND);
        }
        return universalFunctions.sendSuccess(
          {
            statusCode: 200,
            message: responseMessages.SUCCESS,
            data: userData,
          },
          res
        );
      } catch (err) {
        return universalFunctions.sendError(err, res);
      }
      break;
    case "PUT":
      try {
        const schema = joi.object({
          userName: joi.string().required(),
          age: joi.number().required(),
          hobbies: joi.array(),
        });

        await universalFunctions.validateRequestPayload(req.body, res, schema);

        let userData = await User.findOneAndUpdate({ _id: UserId }, req.body);
        if (!userData) {
          throw Boom.notFound(responseMessages.USER_NOT_FOUND);
        }
        return universalFunctions.sendSuccess(
          {
            statusCode: 200,
            message: responseMessages.USER_UPDATED_SUCCESSFULLY,
            data: {},
          },
          res
        );
      } catch (err) {
        return universalFunctions.sendError(err, res);
      }
      break;

    case "DELETE":
      try {
        let userData = await User.findOneAndDelete({ _id: UserId });
        if (!userData) {
          throw Boom.notFound(responseMessages.USER_NOT_FOUND);
        }
        return universalFunctions.sendSuccess(
          {
            statusCode: 200,
            message: responseMessages.USER_DELETED_SUCCESSFULLY,
            data: {},
          },
          res
        );
      } catch (err) {
        return universalFunctions.sendError(err, res);
      }
      break;
  }
}
