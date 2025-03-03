import Swal from "sweetalert2";

const Alert = ({ title, text, icon }) => {
  return Swal.fire({
    title,
    text,
    icon,
  });
};

export default Alert;
