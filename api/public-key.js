module.exports = (req, res) => {
  res.send({
    publicKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
}