import { useState, useEffect } from "react";
import { useAddNewNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const NewNoteForm = ({ users }) => {
  const [addNewNote, { isLoading, isSuccess, isError, error }] =
    useAddNewNoteMutation();

  const navigate = useNavigate();

  const [userId, setUserId] = useState(users.id);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setUserId("");
      setTitle("");
      setText("");
      navigate("/dash/notes");
    }
  }, [isSuccess, navigate]);

  const canSave = [title, text, userId].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewNote({ user: userId, title, text });
    }
  };

  const options = users.map((i) => {
    return (
      <option value={i.id} key={i.id}>
        {i.username}
      </option>
    );
  });

  const content = (
    <>
      {isError && <p className="errmsg">{error?.data?.message}</p>}

      <form className="form" onSubmit={onSaveNoteClicked}>
        <div className="form__title-row">
          <h2>New Note</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label htmlFor="title" className="form__label">
          Title:
        </label>

        <input
          className={`form__input ${!title ? "form__input--incomplete" : ""}`}
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="text" className="form__label">
          Text:
        </label>

        <input
          className={`form__input ${!text ? "form__input--incomplete" : ""}`}
          id="text"
          name="text"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <label
          htmlFor="username"
          className="form__label form__checkbox-container"
        >
          ASSIGNED TO:
        </label>

        <select
          name="username"
          className="form__select"
          value={userId}
          id="username"
          onChange={(e) => setUserId(e.target.value)}
        >
          {options}
        </select>
      </form>
    </>
  );

  return content;
};

export default NewNoteForm;
