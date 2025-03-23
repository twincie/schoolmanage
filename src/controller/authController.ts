import { Request, Response } from "express";
import AuthService from "../services/authService";
import { userExistsByEmail, userExistsByUsername, validateEmail, validatePasswordStrength } from "../utils/authUtils";

export default class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response) => {
    try {
      const { email, username, password, role } = req.body;
      const isStrong = await validatePasswordStrength(password);
      if (!isStrong) {
        console.log("[-] Password is weak.");
        res.status(200).send({ status: "99", message: "Password is weak" })
        return;
      }
      const usernameExists = await userExistsByUsername(username);
      if (!isStrong) {
        console.log("[-] Username Already exists.");
        res.status(200).send({ status: "99", message: "Username Already exists" })
        return;
      }
      const isEmail = await validateEmail(email);
      if (!isEmail) {
        console.log("[-] Invalid Email");
        res.status(200).send({ status: "99", message: "Email Not valid." })
        return;
      }
      const emainExists = await userExistsByEmail(email);
      if (!isStrong) {
        console.log("[-] Email Already Exists.");
        res.status(200).send({ status: "99", message: "Email Already Exists" })
        return;
      }
      const savedUser = await this.authService.registerUser(email, username, password, role);
      if (!savedUser) {
        res.status(200).send({ status: "99", message: "User already exists." })
        return;
      }
      res.status(200).send({ status: "00", message: "User succcessfully created.", data: savedUser });
    } catch (err) {
      console.log("[-] Error occured when creating User : " + err);
      res.status(200).send({
        status: "99",
        message: "Some error occurred while creating User."
      });
    }

  }

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        res.status(200).send({
          status: "99",
          message: "Email and password are required."
        });
        return;
      }

      // Attempt to login
      const tokenData = await this.authService.login(email, password);

      if (!tokenData) {
        res.status(200).send({
          status: "99",
          message: "Invalid email or password."
        });
        return;
      }

      // Return tokens on successful login
      res.status(200).send({
        status: "00",
        message: "Login successful.",
        data: {
          token: tokenData.token,
          refreshToken: tokenData.refreshToken,
          expiresAt: tokenData.expiresAt
        }
      });
      return;
    } catch (err) {
      console.log("[-] Error occurred during login: " + err);
      res.status(200).send({
        status: "99",
        message: "Some error occurred during login."
      });
      return;
    }
  }

  refreshToken = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      // Validate required fields
      if (!refreshToken) {
        res.status(200).send({
          status: "99",
          message: "Refresh token is required."
        });
        return;
      }

      // Attempt to refresh the token
      const newTokens = await this.authService.refreshToken(refreshToken);

      if (!newTokens) {
        res.status(200).send({
          status: "99",
          message: "Invalid or expired refresh token."
        });
        return;
      }

      // Return new tokens on successful refresh
      res.status(200).send({
        status: "00",
        message: "Token refreshed successfully.",
        data: {
          token: newTokens.token,
          refreshToken: newTokens.refreshToken,
          expiresAt: newTokens.expiresAt
        }
      });
      return;
    } catch (err) {
      console.log("[-] Error occurred during token refresh: " + err);
      res.status(200).send({
        status: "99",
        message: "Some error occurred during token refresh."
      });
      return;
    }
  }

  validateToken = async (req: Request, res: Response) => {
    try {
      // Get token from authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(200).send({
          status: "99",
          message: "No token provided."
        });
        return;
      }

      // Extract token from header
      const token = authHeader.split(' ')[1];

      // Validate the token
      const validation = await this.authService.validateToken(token);

      if (!validation.isValid) {
        res.status(200).send({
          status: "99",
          message: "Invalid or expired token."
        });
        return;
      }

      // Return user data if token is valid
      res.status(200).send({
        status: "00",
        message: "Token is valid.",
        data: {
          email: validation.email,
          role: validation.role
        }
      });
      return;
    } catch (err) {
      console.log("[-] Error occurred during token validation: " + err);
      res.status(200).send({
        status: "99",
        message: "Some error occurred during token validation."
      });
    }
  }
}