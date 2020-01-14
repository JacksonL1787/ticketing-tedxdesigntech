const { writer } = require('../pool')
const tables = require('../tables')


module.exports = async (customer) => {

  try {
    await writer(tables.stripeCustomers)
      .insert({
        email: customer.email,
        stripe_id: customer.stripe_id
      })
  } catch(e) {
    throw new Error('Error adding customer to database')
  }
  return;
}
