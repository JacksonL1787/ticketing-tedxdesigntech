const getUserFromSession = require("../db/getUserFromSession");

module.exports = async (req, res, next) => {
  function sendUnauthorized() {
    if (
      req.header["x-requested-with"] &&
      req.header["x-requested-with"].toLowerCase() === "xmlhttprequest"
    ) {
      res.sendStatus(401);
    } else {
      res.redirect("/");
    }
  }
  if (!req.cookies.session_string) {
    if (res.locals.requiresAuth !== false) {
      return sendUnauthorized();
    } else {
      return;
    }
  }

  let user;
  try {
    user = await getUserFromSession(req.cookies.session_string);
    console.log(user);
    if (user.length !== 1 && res.locals.requiresAuth !== false) {
      return sendUnauthorized();
    } else {
      res.locals.user = user[0];
    }
    if (res.locals.requiresAuth === false) {
      return;
    }
    next();
  } catch (e) {
    console.log("Database Error: ", e);
    return res.sendStatus(500);
  }
};
