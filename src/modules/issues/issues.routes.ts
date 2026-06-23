import { Router } from 'express';
import auth from '../../middleware/auth.js';
import { issueController } from './issues.controller.js';

const router = Router();

router.post("/", auth(), issueController.createIssue);
router.get("/", issueController.getAllIssues)
router.get("/:id", issueController.getSingleIssue)
router.patch("/:id", auth('maintainer'), issueController.updateSingleIssue)
router.delete("/:id", auth('maintainer'), issueController.deleteIssue)
export const issueRoute = router;