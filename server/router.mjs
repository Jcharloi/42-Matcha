import express from "express";
import path from "path";

const router = express.Router();

// import homeRoutes from "./helpers/home.mjs";
// import signInRoutes from "./helpers/signIn.mjs";
import signUpRoutes from "./helpers/signUp.mjs";
// import getUserRoutes from "./helpers/profile/getUserInfos.mjs";
// import profileRoutes from "./helpers/profile/profile.mjs";
// import picturesRoutes from "./helpers/profile/pictures.mjs";
// import tagRoutes from "./helpers/profile/tags.mjs";

// router.put("/verify-token", homeRoutes.verifyToken);

// router.post("/connection", signInRoutes.connection);
// router.put("/reset-password", signInRoutes.resetPassword);
// router.get("/reset-password/:id", signInRoutes.resetPasswordId);
// router.put("/new-password", signInRoutes.newPassword);

router.post("/inscription", signUpRoutes.inscription);
// router.get("/validate-account/:id", signUpRoutes.validateAccount);

// router.all("/profile/*", homeRoutes.tokenMiddleware);
// router.post("/profile/check-profile", getUserRoutes.checkFullProfile);
// router.post("/profile/get-user-pictures", getUserRoutes.getUserPictures);
// router.post("/profile/get-user-progress-bar", getUserRoutes.getUserProgressBar);
// router.put("/profile/get-user-city", getUserRoutes.getUserCity);
// router.post("/profile/get-user-personal", getUserRoutes.getUserPersonal);
// router.post("/profile/get-user-preferences", getUserRoutes.getUserPreferences);
// router.post("/profile/get-user-tags", getUserRoutes.getUserTags);
// router.post("/profile/upload-pictures", picturesRoutes.uploadPictures);
// router.put("/profile/delete-pictures", picturesRoutes.deletePictures);
// router.put("/profile/set-main-pictures", picturesRoutes.setMainPictures);
// router.put("/profile/change-personal-infos", profileRoutes.changePersonalInfos);
// router.put(
//   "/profile/change-preference-infos",
//   profileRoutes.changePreferenceInfos
// );
// router.put("/profile/select-tags", tagRoutes.selectTags);
// router.put("/profile/delete-tags", tagRoutes.deleteTags);
// router.post("/profile/add-custom-tags", tagRoutes.addCustomTags);
// router.put("/profile/change-password", profileRoutes.changePassword);

// router.get("/public/profile-pictures/:id", (req, res) => {
//   const pictureName = req.params.id;
//   const absolutePath = path.resolve("./public/profile-pictures/" + pictureName);
//   res.sendFile(absolutePath);
// });

export default router;
