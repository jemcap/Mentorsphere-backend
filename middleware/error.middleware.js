export default function errorHandler(err, req, res, next) {
  console.log(err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server error",
  });
}
