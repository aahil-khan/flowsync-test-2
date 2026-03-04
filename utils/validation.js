const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

const validateUsername = (username) => {
  // 3-20 alphanumeric chars and underscore
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(username);
};

const validateTaskTitle = (title) => {
  return typeof title === 'string' && title.trim().length > 0 && title.length <= 200;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
  validateTaskTitle
};
