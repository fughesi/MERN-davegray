import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isSuccess, isError, isLoading, isUninitialized, error }] =
    useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        try {
          await refresh();
          setTrueSuccess(true);
        } catch (error) {
          console.log(error);
        }
      };
      if (!token && persist) verifyRefreshToken();
    }
    return () => (effectRan.current = true);
    //   eslint-disable-next-line
  }, []);

  let content;
  if (!persist) {
    console.log("no persist");
    content = <Outlet />;
  } else if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    console.log("Error: ", error);
    content = (
      <p className="errmsg">
        {error.data?.message}
        <Link to="/login">Please log back in</Link>
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    content = <Outlet />;
  } else if (token && isUninitialized) {
    console.log(isUninitialized);
    content = <Outlet />;
  }

  return content;
};

export default PersistLogin;
