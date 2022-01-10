import React, { useState, useReducer, useContext, useEffect } from "react";

import Card from "../UI/Card/Card";
import Button from "../UI/Button/Button";
import AuthContext from "../../context/auth-context";

import classes from "./Login.module.css";

const emailReducer = (state, action) => {
   switch (action.type) {
      case "USER_INPUT":
         return { value: action.val, isValid: action.val.includes("@") };
      case "INPUT_BLUR":
         return { value: state.value, isValid: state.value.includes("@") };
      default:
         return { value: "", isValid: false };
   }
};

const passwordReducer = (state, action) => {
   switch (action.type) {
      case "USER_INPUT":
         return { value: action.val, isValid: action.val.length > 6 };
      case "INPUT_BLUR":
         return { value: state.value, isValid: state.value.length > 6 };
      default:
         return { value: "", isValid: false };
   }
};

const Login = (props) => {
   const [formIsValid, setFormIsValid] = useState(false);

   const [emailState, dispatchEmail] = useReducer(emailReducer, {
      value: "",
      isValid: null,
   });

   const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
      value: "",
      isValid: null,
   });

   const authCtx = useContext(AuthContext);

   const { isValid: emailIsValid } = emailState;
   const { isValid: passwordIsValid } = passwordState;

   useEffect(() => {
      const id = setTimeout(() => {
         setFormIsValid(emailIsValid && passwordIsValid);
         console.log("CHECKING FORM VALIDITY");
      }, 500);

      return () => clearTimeout(id);
   }, [emailIsValid, passwordIsValid]);

   // --- EMAIL ---

   const emailChangeHandler = (event) => {
      dispatchEmail({ type: "USER_INPUT", val: event.target.value });
   };

   const validateEmailHandler = () => {
      dispatchEmail({ type: "INPUT_BLUR" });
   };

   // --- PASSWORD ---

   const passwordChangeHandler = (event) => {
      dispatchPassword({ type: "USER_INPUT", val: event.target.value });
   };

   const validatePasswordHandler = () => {
      dispatchPassword({ type: "INPUT_BLUR" });
   };

   // ------

   const submitHandler = (event) => {
      event.preventDefault();
      authCtx.onLogin(emailState.value, passwordState.value);
   };

   return (
      <Card className={classes.login}>
         <form onSubmit={submitHandler}>
            <div
               className={`${classes.control} ${
                  emailState.isValid === false ? classes.invalid : ""
               }`}
            >
               <label htmlFor="email">E-Mail</label>
               <input
                  type="email"
                  id="email"
                  value={emailState.value}
                  onChange={emailChangeHandler}
                  onBlur={validateEmailHandler}
               />
            </div>
            <div
               className={`${classes.control} ${
                  passwordState.isValid === false ? classes.invalid : ""
               }`}
            >
               <label htmlFor="password">Password</label>
               <input
                  type="password"
                  id="password"
                  value={passwordState.value}
                  onChange={passwordChangeHandler}
                  onBlur={validatePasswordHandler}
               />
            </div>
            <div className={classes.actions}>
               <Button
                  type="submit"
                  className={classes.btn}
                  disabled={!formIsValid}
               >
                  Login
               </Button>
            </div>
         </form>
      </Card>
   );
};

export default Login;
