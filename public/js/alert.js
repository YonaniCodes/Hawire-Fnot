const alertsContainer=document.querySelector("body")

export const showAlert = (type, msg) => {
  const alertDiv = document.createElement('div');
  alertDiv.classList.add('alert', `alert--${type}`);
  alertDiv.innerHTML = msg;

  // Append to the container
  alertsContainer.appendChild(alertDiv);

  // Optional: Automatically remove after 3 seconds
  setTimeout(() => {
    alertDiv.remove(); 
  }, 3000);
};
