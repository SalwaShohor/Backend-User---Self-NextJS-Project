export function handleControllerError(res, err) {
  console.error("Controller Error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
}
