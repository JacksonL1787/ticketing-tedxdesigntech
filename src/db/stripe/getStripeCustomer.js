const { reader } = require('../pool')
const tables = require('../tables')

module.exports = async (email) => {
  let customer;
  try {
    customer = await reader
      .select('stripe_id', 'email')
      .from('stripe_customers')
      .where('email', email)
  } catch(e) {
    throw new Error('Error fetching customer: ', e)
  }
  return customer[0]
}
