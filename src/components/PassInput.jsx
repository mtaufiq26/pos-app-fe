import { useState, useEffect } from "react";
import { Button, Input, InputGroup } from "react-daisyui";
import { FaEye, FaEyeSlash } from "react-icons/fa";

/**
 *
 * @param {{ placeholder: string, id: string, name: string, className: string, inputClassName: string}} props
 * @returns
 */
export default function PassInput(props) {
  const [showPass, setShowPass] = useState(false);

  const toggleShow = function () {
    setShowPass((show) => !show);
  };

  return (
    <InputGroup className={props.className}>
      <Input
        type={showPass ? "text" : "password"}
        id={props.id}
        name={props.name}
        className={props.inputClassName}
        placeholder={props.placeholder}
      />
      <Button type="button" onClick={toggleShow}>
        {showPass ? <FaEyeSlash /> : <FaEye />}
      </Button>
    </InputGroup>
  );
}
