import { Router } from "express";
import { UserAccountController } from "../controllers/userAccount.controller";

const router = Router();
const controller = new UserAccountController();

router.get("/", (req, res) => controller.list(req, res));
router.post("/", (req, res) => controller.create(req, res));
router.put("/:id", (req, res) => controller.update(req, res));

export default router;
