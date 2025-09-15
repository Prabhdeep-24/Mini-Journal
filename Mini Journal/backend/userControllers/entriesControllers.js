import { validationResult } from 'express-validator';
import Entry from '../models/Entry.js';

function formatEntry(entry) {
  if (!entry) return null;
  let dateStr = null;
  try {
    if (entry.date instanceof Date) {
      dateStr = entry.date.toISOString().split('T')[0];
    } else if (typeof entry.date === 'string') {
      const d = new Date(entry.date);
      if (!Number.isNaN(d.getTime())) dateStr = d.toISOString().split('T')[0];
      else dateStr = entry.date;
    } else {
      dateStr = entry.createdAt ? new Date(entry.createdAt).toISOString().split('T')[0] : null;
    }
  } catch (e) {
    dateStr = entry.date ? String(entry.date) : null;
  }

  return {
    id: entry._id ? entry._id.toString() : undefined,
    date: dateStr,
    content: entry.content
  };
}

export const createEntry = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { date, content } = req.body; 
  try {
    const entry = await Entry.create({
      userId: req.user.id,
      date,
      content
    });

    return res.status(201).json(formatEntry(entry));
  } catch (err) {
    next(err);
  }
};

export const getEntries = async (req, res, next) => {
  try {
    const entries = await Entry.find({ userId: req.user.id }).sort({ date: -1 }).lean();
    return res.json(entries.map(formatEntry));
  } catch (err) {
    next(err);
  }
};

export const getEntry = async (req, res, next) => {
  try {
    const entry = await Entry.findById(req.params.id).lean();
    if (!entry || String(entry.userId) !== String(req.user.id)) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    return res.json(formatEntry(entry));
  } catch (err) {
    next(err);
  }
};

export const updateEntry = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.content !== undefined) updates.content = req.body.content;
    if (req.body.date !== undefined) updates.date = req.body.date;

    const entry = await Entry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updates,
      { new: true }
    ).lean();

    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    return res.json(formatEntry(entry));
  } catch (err) {
    next(err);
  }
};

export const deleteEntry = async (req, res, next) => {
  try {
    const entry = await Entry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    return res.json({ message: 'Entry deleted' });
  } catch (err) {
    next(err);
  }
};