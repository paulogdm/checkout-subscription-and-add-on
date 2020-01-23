const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = (res, req) => {
  const planId = process.env.SUBSCRIPTION_PLAN_ID;
  const domainURL = process.env.DOMAIN;

  let session;
  const { isBuyingSticker } = req.body;
  if (isBuyingSticker) {
    // Customer is signing up for a subscription and purchasing the extra e-book
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          name: "Pasha e-book",
          quantity: 1,
          currency: "usd",
          amount: 300
        }
      ],
      subscription_data: {
        items: [
          {
            plan: planId
          }
        ]
      },
      success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/cancel.html`
    });
  } else {
    // Customer is only signing up for a subscription
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      subscription_data: {
        items: [
          {
            plan: planId
          }
        ]
      },
      success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/cancel.html`
    });
  }

  res.send({
    checkoutSessionId: session.id
  });
}
