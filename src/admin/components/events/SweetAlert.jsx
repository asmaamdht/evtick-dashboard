import Swal from "sweetalert2";

export const showSuccess = (message) => {
  return Swal.fire({
    icon: "success",
    title: message,
    timer: 1500,
    showConfirmButton: false,
  });
};

export const showError = (message) => {
  return Swal.fire({
    icon: "error",
    title: message,
  });
};

export const showWarning = (message) => {
  return Swal.fire({
    icon: "warning",
    title: message,
    timer: 1500,
    showConfirmButton: false,
  });
};


export const showConfirm = async (message) => {
  return Swal.fire({
    icon: "warning",
    title: message,
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });
};

export const showLoginSuccess = (message = "You have successfully logged in!", name) => {
  Swal.fire({
    title: `Welcome Back ${name}`,
    text: message,
    icon: "success",
    iconColor: "#0F9386",
    background: "#fff",
    color: "#333",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });
};