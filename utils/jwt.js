import jwt from "jsonwebtoken";

// JWT Creation

export function generateJWT(user) {
  return jwt.sign(
    /*
        Payload - { id: user._id, username: user.username }: This is the 
        data that will be encoded in the token. It extracts the user's ID 
        and username from the user object.
    */
    { id: user._id, username: user.username },

    /*
        Secret Key - process.env.JWT_SECRET: This is the secret key used 
        to sign the token, stored as an environment variable for security.
    */
    process.env.JWT_SECRET,

    /*
        Options - { expiresIn: "1h" }: This sets the token to expire after 1 hour.
    */
    { expiresIn: "1h" }
  );
}
