import * as yup from 'yup';

const loginSchema = yup.object({
  identifier: yup.string().required().max(150),
  password: yup.string().required().max(200),
});

const signUpSchema = yup.object({
  email: yup.string().email().required(),
  username: yup.string().max(150).optional(),
  password: yup.string().min(8).max(200).required(),
  acceptTerms: yup.boolean().oneOf([true]).required(),
});

const verifyEmailSchema = yup.object({
  token: yup.string().required(),
});

const retrievePasswordSchema = yup.object({
  email: yup.string().email().required(),
});

const resetPasswordSchema = yup.object({
  token: yup.string().required(),
  password: yup.string().min(8).max(200).required(),
});

const verify2FASchema = yup.object({
  challengeId: yup.string().required(),
  code: yup.string().required().max(10),
});

export default () => ({
  schemas: {
    loginSchema,
    signUpSchema,
    verifyEmailSchema,
    retrievePasswordSchema,
    resetPasswordSchema,
    verify2FASchema,
  }
});


