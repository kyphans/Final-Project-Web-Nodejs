const express = require("express");
const Router = express.Router();
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const { GOOGLE_CLIENT_ID, JWT_SECRET } = process.env;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const Account = require("../models/user.model");

const registerValidator = require("./validators/registerValidator");
const loginValidator = require("./validators/loginValidator");
const CheckLogin = require("../auth/CheckLogin");

Router.post("/login", loginValidator, (req, res) => {
  let result = validationResult(req);
  if (result.errors.length === 0) {
    let { email, password } = req.body;
    let account = undefined;

    Account.findOne({ email: email })
      .then((acc) => {
        if (!acc) {
          throw new Error("Email không tồn tại");
        }
        account = acc;
        return bcrypt.compare(password, acc.password);
      })
      .then((passwordMatch) => {
        if (!passwordMatch) {
          return res.status(401).json({
            code: 3,
            message: "Đăng nhập thất bại, mật khẩu không chính xác",
          });
        }
        const { JWT_SECRET } = process.env;
        jwt.sign(
          {
            email: account.email,
            name: account.name,
          },
          JWT_SECRET,
          {
            expiresIn: "1h",
          },
          (err, token) => {
            if (err) throw err;
            // let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token });
            // this._http.post(URL,DATA, {headers: headers});
            return res.json({
              code: 0,
              message: "Đăng nhập thành công",
              email: account.email,
              name: account.name,
              faculty: account.faculty,
              token: token,
            });
          }
        );
      })
      .catch((e) => {
        return res
          .status(401)
          .json({ code: 2, message: "Đăng nhập thất bại: " + e.message });
      });
  } else {
    let messages = result.mapped();
    let message = "";
    for (m in messages) {
      message = messages[m].msg;
      break;
    }
    return res.json({ code: 1, message: message });
  }
});

Router.post("/oauth/google", async (req, res) => {
  const { token } = req.body;
  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
  } catch (err) {
    console.error(err);
  }

  const payload = ticket.getPayload();

  const { name, picture, email } = payload;

  Account.findOne({ email })
    .then((acc) => {
      if (!acc) {
        let user = new Account({
          name,
          picture,
          email,
        });
        return user.save();
      }
    })
    .then(() => {
      jwt.sign(
        {
          email,
          name,
        },
        JWT_SECRET,
        {
          expiresIn: "1h",
        },
        (err, token) => {
          if (err) throw err;
          return res.json({
            code: 0,
            message: "Đăng nhập thành công",
            email,
            name,
            token,
          });
        }
      );
    })
    .catch((e) => {
      return res
        .status(401)
        .json({ code: 2, message: "Đăng nhập thất bại: " + e.message });
    });
});

Router.post("/register", registerValidator, (req, res) => {
  let result = validationResult(req);
  if (result.errors.length === 0) {
    let {
      type,
      role,
      department_id,
      username,
      password,
      email,
      name,
      faculty,
      class_name,
      profile_picture,
      categories,
    } = req.body;
    Account.findOne({ email: email })
      .then((acc) => {
        if (acc) {
          throw new Error("Tài khoản này đã tồn tại (email)");
        }
      })
      .then(() => bcrypt.hash(password, 10))
      .then((hashed) => {
        let user = new Account({
          type: type,
          role: role,
          department_id: department_id,
          email: email,
          username: username,
          password: hashed,
          name: name,
          faculty: faculty,
          class_name: class_name,
          categories: categories,
        });
        return user.save();
      })
      .then(() => {
        // không cần trả về chi tiết tài khoản nữa
        return res.json({ code: 0, message: "Đăng ký tài khoản thành công" });
      })
      .catch((e) => {
        return res.json({
          code: 2,
          message: "Đăng ký tài khoản thất bại: " + e.message,
        });
      });
  } else {
    let messages = result.mapped();
    let message = "";
    for (m in messages) {
      message = messages[m].msg;
      break;
    }
    return res.json({ code: 1, message: message });
  }
});

Router.get("/create", (req, res) => {
  res.render("create_account.ejs", { layout: "./layouts/layout" });
});

module.exports = Router;
