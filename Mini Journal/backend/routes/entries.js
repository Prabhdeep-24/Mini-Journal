import express from 'express';
import * as entriesController from '../userControllers/entriesControllers.js';
import { body } from 'express-validator';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.post(
  '/',
  [
    body('date').isISO8601().withMessage('Date must be YYYY-MM-DD'),
    body('content').isLength({ min: 1 }).withMessage('Content required'),
  ],
  entriesController.createEntry
);

router.get('/', entriesController.getEntries);

router.get('/:id', entriesController.getEntry);

router.patch('/:id', entriesController.updateEntry);

router.delete('/:id', entriesController.deleteEntry);

export default router;