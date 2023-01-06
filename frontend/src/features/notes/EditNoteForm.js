import { useState, useEffect } from "react";
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

const EditNoteForm = ({ note, users }) => {
  const { isManager, isAdmin } = useAuth();

  const [updateNote, { isLoading, isSuccess, isError, error }] =
    useUpdateNoteMutation();

  const [
    deleteNote,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteNoteMutation();

  const navigate = useNavigate();

  const [text, setText] = useState(note.text);
  const [title, setTitle] = useState(note.title);
  const [completed, setCompleted] = useState(note.completed);
  const [userId, setUserId] = useState(note.user);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("");
      setText("");
      setUserId("");
      navigate("/dash/notes");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const canSave = [title, text, userId].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async (e) => {
    if (canSave) {
      await updateNote({ id: note.id, user: userId, title, text, completed });
    }
  };

  const created = new Date(note.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const updated = new Date(note.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const options = users.map((i) => {
    return (
      <option key={i.id} value={i.id}>
        {i.username}
      </option>
    );
  });

  let deleteButton = null;
  if (isManager || isAdmin) {
    deleteButton = (
      <button
        className="icon-button"
        title="Delete"
        onClick={async (e) => await deleteNote({ id: note.id })}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    );
  }

  const content = (
    <>
      {(isError || isDelError) && (
        <p className="errMsg">
          {(error?.data?.message || delerror?.data?.message) ?? ""}
        </p>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="form">
        <div className="form__title-row">
          <h2>Edit Note #{note.ticket}</h2>

          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveNoteClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>

            {deleteButton}
          </div>
        </div>

        <label htmlFor="note-title" className="form__label">
          Title:
        </label>

        <input
          type="text"
          className={`form__input ${!title ? "form__input--incompleted" : ""}`}
          id="note-title"
          name="title"
          autoComplete="off"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="note-text" className="form__label">
          Text:
        </label>

        <input
          type="text"
          className={`form__input ${!text ? "form__input--incompleted" : ""}`}
          id="note-text"
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="form__row">
          <div className="form__divider">
            <label
              htmlFor="note-completed"
              className="form__label form__checkbox-container"
            >
              COMPLETED:
              <input
                type="checkbox"
                className="form__checkbox"
                id="note-completed"
                name="completed"
                checked={completed}
                onChange={setCompleted((i) => !i)}
              />
            </label>

            <label
              htmlFor="note-username"
              className="form__label form__checkbox-container"
            >
              ASSIGNED TO:
            </label>
            <select
              name="username"
              id="note-username"
              className="form__select"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            >
              {options}
            </select>
          </div>
          <div className="form__divider">
            <p className="form__created">
              Created: <br />
              {created}
            </p>
            <p className="form__updated">
              Updated: <br />
              {updated}
            </p>
          </div>
        </div>
      </form>
    </>
  );

  return content;
};

export default EditNoteForm;
