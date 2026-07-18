import { Router } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import eventsRouter from "./events";
import registrationsRouter from "./registrations";
import chatRouter from "./chat";
import noticesRouter from "./notices";
import sosRouter from "./sos";
import myRouter from "./my";

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
