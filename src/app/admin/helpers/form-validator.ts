// Collection of reusable RegExps
export const regExps: { [key: string]: RegExp } = {
  str: /^[a-zA-Z]/, // Validates only strings
  num: /^\d+$/, // Validates only numbers
  min_eight: /^.{7,}$/, // Validates minimum 8 characters
  email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, // Validates email
};

// Collection of reusable error messages
export const errorMessages: { [key: string]: string } = {
  name: 'Requerido y solo letras',
  dni: 'Requerido y solo números',
  email: 'Requerido y formato de email',
  phone: 'Requiredo y solo números',
  role: 'Solo letras',
  statu: 'Solo letras',
  password: 'Requerido y mínimo 8 caracteres',
};
