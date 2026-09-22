const { sampleUserService } = require("../services");
const { StatusCodes } = require("http-status-codes");
const ApiRes = require("../utils/api-response");
const catchAsync = require("../utils/catch-async"); 


// controller --> controller just used to structure the output responses not logic

// mostly focus how user will get data --> with proper format 

exports.createSampleUser = catchAsync(async (req, res, next) => {
  console.log(req?.body, "sample data")
  const Sampleuser = await sampleUserService.createSampleUser({
    name: req.body.name,
  });
  res.status(StatusCodes.CREATED).json(new ApiRes(StatusCodes.CREATED, true, "Sample User Created", Sampleuser))
})



