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
const login = async (email, password) => {
  console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/user/login',
      data: {
        email: email,
        password: password,
      },
    });
    if (res.data.status === 'success') {
      showalerts('success', 'Logged In Suceess');
      window.setTimeout(() => {
        location.assign('/overview');
      }, 1500);
    }
    console.log('Hello from login try');
    // console.log(res);
  } catch (error) {
    showalerts('error', error.response.data.message);
    console.log('Hello from login error');
    // console.log(error.response.data);
  }
};
document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});

