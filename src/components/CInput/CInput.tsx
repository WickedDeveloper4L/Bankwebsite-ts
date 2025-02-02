import React from "react";
import "./CInput.scss";

interface CInputProps {
  value: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  name: string;
  required: boolean;
  placeholder: string;
  id: string;
  label: string;
}
const CInput = (props: CInputProps) => {
  return (
    <div className="input_group">
      <label htmlFor={props.id} className="label">
        {props.label}
      </label>
      <input
        className="input"
        value={props.value}
        onChange={props.handleChange}
        type={props.type}
        name={props.name}
        required={props.required}
        placeholder={props.placeholder}
        id={props.id}
      />
    </div>
  );
};

export default CInput;
