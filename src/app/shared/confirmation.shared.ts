import Swal from 'sweetalert2';

export const showConfirmation = (
  title: string,
  text: string,
  icon: 'warning' | 'success' | 'error'
) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: icon,
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No, cancel!',
  });
};
