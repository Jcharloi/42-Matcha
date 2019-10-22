import express from "express";
import path from "path";

const router = express.Router();

import { tokenMiddleware, verifyToken } from "./token.mjs";
import {
  getUserAll,
  getAllTags,
  getUserCity,
  getTags,
  getUserPictures,
  getUserMainPic
} from "./helpers/profile/getUserInfos.mjs";

import { connection } from "./helpers/auth/signIn.mjs";
import { inscription, validateAccount } from "./helpers/auth/signUp.mjs";
import {
  resetPassword,
  newPassword,
  resetPasswordId
} from "./helpers/auth/resetPassword.mjs";
import {
  disconnect,
  checkConnection
} from "./helpers/auth/updateLastConnection.mjs";

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
import { checkLikeAndMatch } from "./helpers/profile/likes.mjs";
import {
  getUserVisitsAndLikes,
  visitedUser
} from "./helpers/profile/visits.mjs";
import { sanctioningUser } from "./helpers/admin/sanctioning.mjs";
import { getUsersByPreference } from "./helpers/home/match.mjs";
import { sortByIndex } from "./helpers/home/sort.mjs";
import { filterByInterval } from "./helpers/home/filter.mjs";
import { getUsersBySearch } from "./helpers/home/search.mjs";
import getReports from "./helpers/profile/reports.mjs";
import {
  getNotification,
  sawNotification
} from "./helpers/profile/notifications.mjs";
import {
  getAllMessages,
  checkAndGetSender,
  readMessage,
  getMessagesPeople,
  sendNewMessage
} from "./helpers/message/message.mjs";
import { deleteUser } from "./helpers/admin/deleteUser.mjs";

router.all("/admin/*", tokenMiddleware);
router.all("/profile/*", tokenMiddleware);
router.all("/home/*", tokenMiddleware);
router.all("/search/*", tokenMiddleware);
router.all("/message/*", tokenMiddleware);
router.put("/verify-token", verifyToken);
router.put("/profile/get-user-infos", getUserAll);

router.post("/inscription", inscription);
router.get("/validate-account/:id", validateAccount);
router.put("/reset-password", resetPassword);
router.get("/reset-password/:id", resetPasswordId);
router.put("/new-password", newPassword);
router.post("/connection", connection);
router.put("/disconnect", disconnect);
router.put("/admin/verify-connection", checkConnection);
router.put("/admin/get-reports", getReports);
router.put("/admin/ban-user", deleteUser);

router.put("/profile/get-user-city", getUserCity);
router.put("/profile/get-user-pictures", getUserPictures);
router.put("/profile/get-user-main-pic", getUserMainPic);
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
router.put("/profile/check-like-and-match", checkLikeAndMatch);
router.post("/profile/get-user-:current", getUserVisitsAndLikes);
router.post("/profile/visit", visitedUser);
router.post("/profile/sanctioning-user", sanctioningUser);
router.put("/profile/change-password", changePassword);
router.put("/home/get-users-by-preference", getUsersByPreference);
router.put("/home/sort-by-index", sortByIndex);
router.put("/home/filter-by-interval", filterByInterval);
router.put("/search/get-users-by-search", getUsersBySearch);
router.put("/message/get-all-messages", getAllMessages);
router.put("/message/get-sender-infos", checkAndGetSender);
router.put("/message/read-message", readMessage);
router.put("/message/get-messages-people", getMessagesPeople);
router.post("/message/send-new-message", sendNewMessage);
router.get("/public/profile-pictures/:id", (req, res) => {
  const pictureName = req.params.id;
  const absolutePath = path.resolve("./public/profile-pictures/" + pictureName);
  res.sendFile(absolutePath);
});
router.put("/profile/get-notification", getNotification);
router.put("/profile/saw-notification", sawNotification);
router.get("/public/fake-pictures/:id", (req, res) => {
  const pictureName = req.params.id;
  const absolutePath = path.resolve("./public/fake-pictures/" + pictureName);
  res.sendFile(absolutePath);
});

export default router;
