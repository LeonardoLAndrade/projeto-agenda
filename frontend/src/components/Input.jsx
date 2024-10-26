const Input = ({ type, id, placeholder, name, value, onChange, readonly }) => {
  return (
    <input
      type={type}
      className="form-control"
      id={id}
      name={name}
      value={value}
      placeholder={placeholder}
      readOnly={readonly ? true : false}
      onChange={onChange}
      required
    />
  );
};

export default Input;
