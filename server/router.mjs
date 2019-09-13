import express from "express";
import path from "path";

const router = express.Router();

import tokenRoutes from "./token.mjs";
import userInfosRoutes from "./helpers/profile/getUserInfos.mjs";

import signInRoutes from "./helpers/auth/signIn.mjs";
import signUpRoutes from "./helpers/auth/signUp.mjs";
import passwordRoutes from "./helpers/auth/resetPassword.mjs";
import getUserRoutes from "./helpers/profile/getUserInfos.mjs";
import profileRoutes from "./helpers/profile/profile.mjs";
import picturesRoutes from "./helpers/profile/pictures.mjs";
import tagRoutes from "./helpers/profile/tags.mjs";
import matchRoutes from "./helpers/home/match.mjs";
import sortRoutes from "./helpers/home/sort.mjs";

router.all("/profile/*", tokenRoutes.tokenMiddleware);
router.all("/home/*", tokenRoutes.tokenMiddleware);
router.put("/verify-token", tokenRoutes.verifyToken);
router.get("/get-user-infos?:id", userInfosRoutes.getUserAll);

router.post("/inscription", signUpRoutes.inscription);
router.get("/validate-account/:id", signUpRoutes.validateAccount);
router.put("/reset-password", passwordRoutes.resetPassword);
router.get("/reset-password/:id", passwordRoutes.resetPasswordId);
router.put("/new-password", passwordRoutes.newPassword);
router.post("/connection", signInRoutes.connection);

router.put("/profile/get-user-city", getUserRoutes.getUserCity);
router.post("/profile/get-tags", getUserRoutes.getTags);
router.post("/profile/upload-pictures", picturesRoutes.uploadPictures);
router.put("/profile/set-main-pictures", picturesRoutes.setMainPictures);
router.put("/profile/delete-pictures", picturesRoutes.deletePictures);
router.put("/profile/change-personal-infos", profileRoutes.changePersonalInfos);
router.put(
  "/profile/change-preference-infos",
  profileRoutes.changePreferenceInfos
);
router.put("/profile/select-tags", tagRoutes.selectTags);
router.put("/profile/delete-tags", tagRoutes.deleteTags);
router.post("/profile/add-custom-tags", tagRoutes.addCustomTags);
router.put("/profile/change-password", profileRoutes.changePassword);

router.post("/home/get-users-by-preference", matchRoutes.getUsersByPreference);
router.post("/home/sort-by-index", sortRoutes.sortByIndex);
router.post("/home/sort-by-interval", sortRoutes.sortByInterval);

router.get("/public/profile-pictures/:id", (req, res) => {
  const pictureName = req.params.id;
  const absolutePath = path.resolve("./public/profile-pictures/" + pictureName);
  res.sendFile(absolutePath);
});
router.get("/public/fake-pictures/:id", (req, res) => {
  const pictureName = req.params.id;
  const absolutePath = path.resolve("./public/fake-pictures/" + pictureName);
  res.sendFile(absolutePath);
});

export default router;
