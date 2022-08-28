export const getUserFromLocalStorage = () => {
  const result = localStorage.getItem("users");
  const user = result ? JSON.parse(result) : null;
  return user;
};

export const addUserToLocalStorage = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem("user");
};
