var stripe = require('stripe')('sk_test_URlG5O3NyeAQKT4MGn2RyyA000jLXPjabW');

module.exports = async (user) => {
  const customer = await stripe.customers.create(
    {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      phone: user.phone_number,
      address: {
        line1: user.address_line_one,
        line2: user.address_line_two,
        city: 'San Mateo',
        state: 'CA',
        postal_code: user.zip_code,
        country: 'US'
      }
    }
  );
  return {stripe_id: customer.id, email: customer.email}
}
