import passport from 'passport';
import { Strategy } from 'passport-local';
import User from './models/UserModel';

passport.use(new Strategy({ usernameField: 'email' },
  (email, password, done) =>
    User.findOne({ email: email.toLowerCase(), password }, done)
));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => User.findById(id, done));

export default passport;
