const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
module.exports = data => {
  const msg = {
    to: data.email,
    from: "noreply@tedxdesigntech.com",
    templateId: "d-c86dede8fae9478c9f771e4c011dc1a4",
    dynamic_template_data: {
      first_name: data.first_name,
      order_info_url: `localhost:3000/order/${data.order_code}`,
      order_code: data.order_code
    }
  };
  sgMail.send(msg);
  return;
};
