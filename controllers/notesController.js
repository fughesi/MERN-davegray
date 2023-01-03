const Note = require("../models/Note");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

//@desc Get all notes
//@route GET /notes
//@access Private
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().lean();

  if (!notes?.length) {
    return res.status(400).json({ message: "no notes found" });
  }

  //add user name
  const noteWithName = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );

  res.json(noteWithName);
});

//@desc create new note
//@route POST /notes
//@access Private
const createNewNote = asyncHandler(async (req, res) => {
  const { title, text, user } = req.body;

  //confirm data
  if (!user || !title || !text) {
    return res.status(400).json({ message: "all fields are required!" });
  }

  //check for duplicate title
  const duplicate = await Note.findOne({ title }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate note title" });
  }

  //create and store new note
  const note = await Note.create({ user, title, text });

  if (note) {
    //created
    res.status(201).json({ message: `New note ${note.title} created` });
  } else {
    res.status(400).json({ message: "Invalid note data received" });
  }
});

//@desc update a note
//@route PATCH /notes
//@access Private
const updateNote = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body;

  //confirm data
  if (
    !id ||
    !username ||
    !title ||
    !user ||
    !text ||
    typeof completed !== "boolean"
  ) {
    return res.status(400).json({ message: "all fields are required" });
  }
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  //check for duplicate title
  const duplicate = await Note.findOne({ title }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate note title" });
  }

  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updatedNote = await note.save();

  res.json({ message: `'${updatedNote.title}' updated` });
});

//@desc delete a user
//@route DELETE /users
//@access Private
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Note ID is required" });
  }

  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  const result = await note.deleteOne();

  const reply = `${result.title} with ID ${result._id} has been deleted`;

  res.json(reply);
});

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
};
