import express from "express";
import path from "path";

const router = express.Router();

import { tokenMiddleware, verifyToken } from "./token.mjs";
import {
  getUserAll,
  getAllTags,
  getUserCity,
  getTags
} from "./helpers/profile/getUserInfos.mjs";

import { connection } from "./helpers/auth/signIn.mjs";
import { inscription, validateAccount } from "./helpers/auth/signUp.mjs";
import {
  resetPassword,
  newPassword,
  resetPasswordId
} from "./helpers/auth/resetPassword.mjs";

import {
  changePersonalInfos,
  changePreferenceInfos,
  changePassword
} from "./helpers/profile/profile.mjs";
import {
  uploadPictures,
  setMainPictures,
  deletePictures
} from "./helpers/profile/pictures.mjs";
import {
  selectTags,
  deleteTags,
  addCustomTags
} from "./helpers/profile/tags.mjs";
import { getUsersByPreference } from "./helpers/home/match.mjs";
import { sortByIndex, filterByInterval } from "./helpers/home/sort.mjs";

router.all("/profile/*", tokenMiddleware);
router.all("/home/*", tokenMiddleware);
router.put("/verify-token", verifyToken);
router.get("/get-user-infos?:id", getUserAll);

router.post("/inscription", inscription);
router.get("/validate-account/:id", validateAccount);
router.put("/reset-password", resetPassword);
router.get("/reset-password/:id", resetPasswordId);
router.put("/new-password", newPassword);
router.post("/connection", connection);

router.put("/profile/get-user-city", getUserCity);
router.put("/profile/get-all-tags", getAllTags);
router.post("/profile/get-tags", getTags);
router.post("/profile/upload-pictures", uploadPictures);
router.put("/profile/set-main-pictures", setMainPictures);
router.put("/profile/delete-pictures", deletePictures);
router.put("/profile/change-personal-infos", changePersonalInfos);
router.put("/profile/change-preference-infos", changePreferenceInfos);
router.put("/profile/select-tags", selectTags);
router.put("/profile/delete-tags", deleteTags);
router.post("/profile/add-custom-tags", addCustomTags);
router.put("/profile/change-password", changePassword);

router.post("/home/get-users-by-preference", getUsersByPreference);
router.post("/home/sort-by-index", sortByIndex);
router.post("/home/filter-by-interval", filterByInterval);

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
