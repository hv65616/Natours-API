const hidealerts = () => {
  const el = document.querySelector('.alert');
  if (el) {
    el.parentElement.removeChild(el);
  }
};
const showalerts = (type, msg) => {
  hidealerts();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hidealerts, 5000);
};
const updatedata = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:3000/api/v1/user/updateMe',
      data: {
        name,
        email,
      },
    });
    if (res.data.status === 'success') {
      showalerts('success', 'Profile Updated Successfully!');
    }
  } catch (error) {
    showalerts('error', error.response.data.message);
  }
};
document.querySelector('.form-user-data').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  updatedata(name, email);
});
// export default updatedata;
