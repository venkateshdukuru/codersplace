// // backend/src/routes/authRoutes.ts
// import express, { RequestHandler } from "express";
// import {
//   register,
//   login,
//   generateAdminInvitation,
//   forgotPassword,
//   resetPassword,
//   logout,
//   registerAdmin,
// } from "../controllers/authcontrollers";
// import {
//   registerValidation,
//   loginValidation,
//   adminInvitationValidation,
//   forgotPasswordValidation,
//   resetPasswordValidation,
//   adminRegisterValidation,
// } from "../middleware/validationMiddleware";
// import { protect, superadminOnly } from "../middleware/authMiddleware";

// const router = express.Router();

// router.post("/register", registerValidation, register as RequestHandler);
// router.post("/register-admin", adminRegisterValidation, registerAdmin as RequestHandler);
// router.post("/login", loginValidation, login as RequestHandler);
// router.post("/admin-invitation", protect, superadminOnly, adminInvitationValidation, generateAdminInvitation as RequestHandler);
// router.post("/forgot-password", forgotPasswordValidation, forgotPassword as RequestHandler);
// router.post("/reset-password", resetPasswordValidation, resetPassword as RequestHandler);
// router.post("/logout", logout as RequestHandler);



// router.post("/generate-admin-invitation", adminInvitationValidation, generateAdminInvitation);


// export default router;




// backend/src/routes/authRoutes.ts
import express, { RequestHandler } from "express";
import {
  initiateRegistration,
  verifyRegistration,
  resendRegistrationOTP,
  login,
  generateAdminInvitation,
  forgotPassword,
  resetPassword,
  logout,
  registerAdmin,
} from "../controllers/authcontrollers";
import {
  registerInitiateValidation,
  registerVerifyValidation,
  resendOtpValidation,
  loginValidation,
  adminInvitationValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  adminRegisterValidation,
} from "../middleware/validationMiddleware";
import { protect, superadminOnly } from "../middleware/authMiddleware";

const router = express.Router();

// Registration with OTP verification
router.post("/register/initiate", registerInitiateValidation, initiateRegistration as RequestHandler);
router.post("/register/verify", registerVerifyValidation, verifyRegistration as RequestHandler);
router.post("/register/resend-otp", resendOtpValidation, resendRegistrationOTP as RequestHandler);

// Admin registration
router.post("/register-admin", adminRegisterValidation, registerAdmin as RequestHandler);

// Login
router.post("/login", loginValidation, login as RequestHandler);

// Admin invitation (only for superadmin)
// router.post("/admin-invitation", protect, superadminOnly, adminInvitationValidation, generateAdminInvitation as RequestHandler);

router.post("/admin-invitation", adminInvitationValidation, generateAdminInvitation as RequestHandler);

// Password reset
router.post("/forgot-password", forgotPasswordValidation, forgotPassword as RequestHandler);
router.post("/reset-password", resetPasswordValidation, resetPassword as RequestHandler);

// Logout
router.post("/logout", logout as RequestHandler);

export default router;