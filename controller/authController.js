const User = require("../model/User")
const Role = require("../model/Role")
const bcrypt = require("bcryptjs")
const { validationResult } = require("express-validator")
const jwt = require('jsonwebtoken')
const { secret } = require('../config.json')

const generateToken = (id, roles) => jwt.sign({ id, roles }, secret, { expiresIn: '24h' })


class authController {

    async registration(req, res) {

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Errors", errors })
            }

            const { username, password } = req.body
            const candidate = await User.findOne({ username })
            if (candidate) {
                return res.status(400).json({ message: "User exists..." })
            }

            const hashPassword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({ value: "USER" })

            const user = new User({ username, password: hashPassword, role: [userRole.value] })
            await user.save()
            res.json({ message: "user successfully created" })



        } catch (error) {

        }

    }

    async login(req, res) {

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Errors", errors })
            }

            const { username, password } = req.body
            const hashPassword = bcrypt.hashSync(password, 7)
            const candidate = await User.findOne({ username, password: hashPassword })
            if (!candidate) {
                return res.status(400).json({ message: "User not found!" })
            }

            const userRole = await Role.findOne({ value: "USER" })
            
            let token = generateToken(candidate.id, userRole)

            res.json({ message: "user successfully logined", token })



        } catch (error) {

        }

    }




}

module.exports = authController