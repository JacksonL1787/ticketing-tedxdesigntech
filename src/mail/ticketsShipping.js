const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
module.exports = data => {
  const msg = {
    to: data.user.email,
    from: "noreply@tedxdesigntech.com",
    templateId: "d-0fd1c0b5aba74e6ba8289e9f6020d0eb",
    dynamic_template_data: {
      first_name: data.user.first_name,
      order_info_url: `localhost:3000/order/${data.order_code}`,
      order_code: data.order_code,
      shipment_tracking_url: `https://www.ups.com/track?tracknum=${data.trackingNumber}`
    }
  };
  sgMail.send(msg);
  return;
};
