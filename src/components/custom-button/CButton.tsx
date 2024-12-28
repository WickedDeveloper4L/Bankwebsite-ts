/* eslint-disable react/prop-types */
import "./cbutton.scss";

interface buttonprops {
  size?: string;
  children: React.ReactNode;
  type?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
const CButton = ({ size, children, type, onClick }: buttonprops) => {
  return (
    <button onClick={onClick} className={`button ${size} ${type}`}>
      {children}
    </button>
  );
};

export default CButton;
