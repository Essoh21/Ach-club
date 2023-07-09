const LocalStrategy = require("passport-local");
const UserModel = require("../model/UserModel");

//Passport Local Strategt configuration
module.exports = (passport) => {
  const strategy = async (pseudoname, password, done) => {
    try {
      const user = await UserModel.findOne({ pseudo: pseudoname });
      if (!user) {
        return done(null, false, {
          message: "incorrect pseudoname or password",
        });
      }
      // if user is found with that pseudo
      const isPasswordCorrect = await user.hasCorrectPassword(password);
      if (!isPasswordCorrect) {
        return done(null, false, {
          message: "incorrect pseudoname or password",
        });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  };

  //use strategy,
  passport.use(
    "local",
    new LocalStrategy({ usernameField: "pseudoname" }, strategy)
  );
  //serialize(add data to req.session.passport.user object)
  //and deserialise(add auth user data to req object(req.user.{})) authenticated user  data
  passport.serializeUser((user, done) => {
    const userId = user._id;
    done(null, userId);
  });
  passport.deserializeUser(async (userId, done) => {
    try {
      const user = await UserModel.findById(userId);
      done(null, user);
    } catch (e) {
      done(e);
    }
  });
};
