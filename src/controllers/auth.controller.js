import logger from '#config/logger.js';
import { createUser, loginUser } from '#services/auth.service.js';
import { cookies } from '#utils/cookies.js';
import { formatValidationError } from '#utils/format.js';
import { jwttoken } from '#utils/jwt.js';
import { signinSchema, signupSchema } from '#validations/auth.validation.js';

export const signup = async (req, res, next) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { name, email, password, role } = validationResult.data;

    const user = await createUser(name, email, password, role);

    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);

    logger.info(`User registered successfully: ${email}`);
    res.status(201).json({
      message: 'Registration success',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    logger.error('Signup error: ', e);
    if (e.message === 'User with this email already exists') {
      return res.status(409).json({
        error: 'email already exists',
      });
    }

    next(e);
  }
};

export const signin = async (req, res, next) => {
  try {
    const validationResult = signinSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    const user = await loginUser(email, password);

    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);

    logger.info(`User logged in successfully: ${email}`);
    res.status(200).json({
      message: 'Login success',
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (e) {
    logger.error('Signin error: ', e);
    next(e);
  }
};

export const logout = (req, res) => {
  try {
    cookies.clear(res, 'token');

    res.status(200).json({
      message: 'User logged out successfully!',
    });
  } catch (e) {
    logger.error(`Error logging out: ${e}`);
    throw new Error(`Error logging out: ${e}`);
  }
};
