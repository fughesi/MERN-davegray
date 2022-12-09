import { useState, useEffect } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";

const EditNoteForm = ({ note, users }) => {
  // const USER_REGEX = /^[A-z]{3,20}$/;
  // const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

  const [updateNote, { isLoading, isSuccess, isError, error }] =
    useUpdateNoteMutation();

  const [
    deleteNote,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteNoteMutation();

  const navigate = useNavigate();

  const [notes, setNotes] = useState(notes.body);
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(user.roles);
  const [active, setActive] = useState(user.active);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);
  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/dash/users");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);

  const onRolesChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRoles(values);
  };

  const onActiveChanged = () => setActive((prev) => !prev);
  const onSaveUserClicked = async (e) => {
    if (password) {
      await updateUser({ id: user.id, username, password, roles, active });
    } else {
      await updateUser({ id: user.id, username, roles, active });
    }
  };

  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id });
  };

  // maybe??########################

  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {role}
      </option>
    );
  });

  // maybe??########################

  let canSave;
  if (password) {
    canSave =
      [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;
  } else {
    canSave = [roles.length, validUsername].every(Boolean) && !isLoading;
  }

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validUserClass = !validUsername ? "form__input--incomplete" : "";
  // const validPwdClass = !validPassword ? "form__input--incomplete" : ""; <----makes red line
  const validRolesClass = !Boolean(roles.length)
    ? "form__input--incomplete"
    : "";
  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form onSubmit={(e) => e.preventDefault()} className="form">
        <div className="form__title-row">
          <h2>Edit User</h2>

          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveUserClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>

            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteUserClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>

        <label htmlFor="username" className="form__label">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>

        <input
          type="text"
          className={`form__input ${validUserClass}`}
          id="username"
          name="username"
          autoComplete="off"
          value={username}
          onChange={onUsernameChanged}
        />

        <label htmlFor="password" className="form__label">
          Password: <span className="nowrap">[empty = no change]</span>
          <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>

        <input
          type="password"
          className={`form__input `}
          id="password"
          name="password"
          value={password}
          onChange={onPasswordChanged}
        />

        <label
          htmlFor="user-active"
          className="form__label form__checkbox-container"
        >
          ACTIVE:
          <input
            type="checkbox"
            className="form__checkbox"
            id="user-active"
            name="user-active"
            checked={active}
            onChange={onActiveChanged}
          />
        </label>

        <label htmlFor="roles" className="form__label">
          ASSIGNED ROLES:
        </label>

        <select
          name="roles"
          id="roles"
          className={`form__select ${validRolesClass}`}
          multiple={true}
          size="3"
          value={roles}
          onChange={onRolesChanged}
        >
          {options}
        </select>
      </form>
    </>
  );

  return content;
};

export default EditNoteForm;
