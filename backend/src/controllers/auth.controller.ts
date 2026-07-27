import { Response } from 'express';
import { AuthService } from '#/services/auth.service.js';
import { AuthRequest } from '#/middleware/auth.middleware.js';
import type { RegisterInput, LoginInput, ChangePasswordInput, UpdateProfileInput } from '#/validators/auth.validator.js';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: AuthRequest, res: Response) => {
    const data: RegisterInput = req.body;
    const result = await this.authService.register(data);

    // Set HTTP-only cookies
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: result,
    });
  };

  login = async (req: AuthRequest, res: Response) => {
    const data: LoginInput = req.body;
    const result = await this.authService.login(data);

    // Set HTTP-only cookies
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: result,
    });
  };

  logout = async (req: AuthRequest, res: Response) => {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(200).json({
      status: 'success',
      message: 'Logout successful',
    });
  };

  refreshToken = async (req: AuthRequest, res: Response) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token not found',
      });
    }

    const result = await this.authService.refreshToken(refreshToken);

    // Set new HTTP-only cookies
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: result,
    });
  };

  forgotPassword = async (req: AuthRequest, res: Response) => {
    const { email } = req.body;
    const result = await this.authService.forgotPassword(email);

    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  };

  resetPassword = async (req: AuthRequest, res: Response) => {
    const { token, password } = req.body;
    const result = await this.authService.resetPassword(token, password);

    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  };

  changePassword = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    const data: ChangePasswordInput = req.body;
    const result = await this.authService.changePassword(
      req.user.id,
      data.currentPassword,
      data.newPassword
    );

    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  };

  getProfile = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    const user = await this.authService.getProfile(req.user.id);

    res.status(200).json({
      status: 'success',
      data: user,
    });
  };

  updateProfile = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    const data: UpdateProfileInput = req.body;
    const user = await this.authService.updateProfile(req.user.id, data);

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: user,
    });
  };
}
