const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = (req, res) => {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  res.send(session);
}
