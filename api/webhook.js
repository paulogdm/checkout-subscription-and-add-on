module.exports = (req, res) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === "checkout.session.completed") {
    const items = data.object.display_items;
    const customer = await stripe.customers.retrieve(data.object.customer);

    if (
      items.length &&
      items[0].custom &&
      items[0].custom.name === "Pasha e-book"
    ) {
      console.log(
        `🔔  Customer is subscribed and bought an e-book! Send the e-book to ${customer.email}.`
      );
    } else {
      console.log(`🔔  Customer is subscribed but did not buy an e-book.`);
    }
  }

  res.sendStatus(200);
}
