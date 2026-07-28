import { Router } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import usersRouter from "./users.js";
import eventsRouter from "./events.js";
import registrationsRouter from "./registrations.js";
import chatRouter from "./chat.js";
import noticesRouter from "./notices.js";
import sosRouter from "./sos.js";
import myRouter from "./my.js";

const router = Router();

router.use("/healthz", healthRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/events/:eventId/registrations", registrationsRouter);
router.use("/events", eventsRouter);
router.use("/chat", chatRouter);
router.use("/notices", noticesRouter);
router.use("/sos", sosRouter);
router.use("/my", myRouter);

export default router;
