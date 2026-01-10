import bcrypt from "bcrypt";

export const genPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
