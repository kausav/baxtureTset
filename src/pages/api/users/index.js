import User from "../../../models/User";
import dbConnect from "../../../services/db";
import joi from "joi";
import universalFunctions from "../../../utils/universalFunctions";
import responseMessages from "../../../resources/response.json";

dbConnect();

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        let userData = await User.find();
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

    case "POST":
      try {
        const schema = joi.object({
          userName: joi.string().required(),
          age: joi.number().required(),
          hobbies: joi.array(),
        });

        await universalFunctions.validateRequestPayload(req.body, res, schema);
        await User.create(req.body);

        return universalFunctions.sendSuccess(
          {
            statusCode: 200,
            message: responseMessages.USER_CREATED_SUCCESSFULLY,
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
