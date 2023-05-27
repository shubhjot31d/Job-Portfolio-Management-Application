const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route      POST  /api/users
// @desc       Register User
// @access     Public

router.post('/', [
    check('name', 'Name is necessary')
        .not()
        .isEmpty(),
    check('email', 'Please enter a valid email id')
        .isEmail(),
    check('password', 'password is necessary')
        .not().isEmpty(),
    check('typeofuser', 'Enter your Type')
        .not()
        .isEmpty()

],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, typeofuser } = req.body;
        try {
            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ errors: [{ msg: "User already exists" }] });
            }

            user = new User({
                name,
                email,
                password,
                typeofuser
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };
            jwt.sign(
                payload,
                config.get('jwtToken'),
                { expiresIn: 3600 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error.');
        }

    });


module.exports = router;