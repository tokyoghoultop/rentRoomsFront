import Swal from "sweetalert2";

const ConfirmAlert = ({ title, btnText, action }) => {
  return Swal.fire({
    title: title,
    showCancelButton: true,
    confirmButtonText: btnText,
  }).then((result) => {
    if (result.isConfirmed) {
        action()
    }
  });
};

export default ConfirmAlert;
