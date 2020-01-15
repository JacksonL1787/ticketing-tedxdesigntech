const stripe = require('stripe')(process.env.STRIPE_API_KEY);

module.exports = async (customer, price, orderId) => {
  const session = await stripe.checkout.sessions.create({
    customer: customer.stripe_id,
    payment_method_types: ['card'],
    line_items: [{
      name: 'TEDxDesignTechHS 2020 Tickets',
      description: 'These are non-refundable tickets to this years 2020 TEDxDesignTechHS event. These tickets will be sent to the address that you provided as your shipping address.',
      amount: price,
      currency: 'usd',
      quantity: 1,
    }],
    client_reference_id: orderId,
    success_url: 'http://localhost:3000/order-processing',
    cancel_url: 'http://localhost:3000/seats/checkout',
  });
  return session;
}
