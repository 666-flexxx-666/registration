const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail) {
    const authenticateUser = async (email, pass, done) => {
        const user = getUserByEmail(email)
        if (user == null) {
            return done(null, false, { message: 'No user found' })
        }
        try {
            if (await bcrypt.compare(pass, user.pass)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'pass' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.email))
    passport.deserializeUser((email, done) => {
        return done(null, getUserByEmail(email))
    })
}

module.exports = initialize