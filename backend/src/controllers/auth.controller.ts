import { Response, CookieOptions } from 'express';
import { AuthService } from '#/services/auth.service.js';
import { AuthRequest } from '#/middleware/auth.middleware.js';
import type { RegisterInput, LoginInput, GoogleLoginInput, ChangePasswordInput, UpdateProfileInput } from '#/validators/auth.validator.js';

const isProduction = process.env.NODE_ENV === 'production';

// The frontend (Vercel) and backend (Render) run on different origins in
// production, so cookies must use SameSite=None to be sent on cross-site
// fetch/XHR requests. SameSite=None requires Secure, which is only valid over
// HTTPS — fine in production, but must stay Lax/insecure for local HTTP dev.
const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
};

const accessTokenCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const refreshTokenCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: AuthRequest, res: Response) => {
    const data: RegisterInput = req.body;
    const result = await this.authService.register(data);

    // Set HTTP-only cookies
    res.cookie('accessToken', result.accessToken, accessTokenCookieOptions);

    res.cookie('refreshToken', result.refreshToken, refreshTokenCookieOptions);

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
    res.cookie('accessToken', result.accessToken, accessTokenCookieOptions);

    res.cookie('refreshToken', result.refreshToken, refreshTokenCookieOptions);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: result,
    });
  };

  googleLogin = async (req: AuthRequest, res: Response) => {
    const { idToken }: GoogleLoginInput = req.body;
    const result = await this.authService.googleLogin(idToken);

    res.cookie('accessToken', result.accessToken, accessTokenCookieOptions);
    res.cookie('refreshToken', result.refreshToken, refreshTokenCookieOptions);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: result,
    });
  };

  logout = async (req: AuthRequest, res: Response) => {
    res.clearCookie('accessToken', baseCookieOptions);
    res.clearCookie('refreshToken', baseCookieOptions);

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
    res.cookie('accessToken', result.accessToken, accessTokenCookieOptions);

    res.cookie('refreshToken', result.refreshToken, refreshTokenCookieOptions);

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
