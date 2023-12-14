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
const updatedata = async (data, type) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:3000/api/v1/user/updateMe',
      data,
    });
    if (res.data.status === 'success') {
      showalerts('success', 'Profile Updated Successfully!');
    }
  } catch (error) {
    showalerts('error', error.response.data);
  }
};
const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/user/logout',
    });
    console.log('LOGOUT!!!');
    if ((res.data.status = 'success')) location.reload(true);
  } catch (error) {
    console.log(error);
  }
};
document.addEventListener('click', (e) => {
  const target = e.target;

  if (target.classList.contains('nav__el--logout')) {
    // Logout button clicked
    logout();
  } else if (target.tagName === 'BUTTON' && target.closest('form')) {
    // Form submitted
    e.preventDefault();

    const form = target.closest('form');

    if (form.classList.contains('form--login')) {
      // Login form submitted
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      login(email, password);
    } else if (form.classList.contains('form-user-data')) {
      const form = new FormData();
      form.append('name', document.getElementById('name').value);
      form.append('email', document.getElementById('email').value);
      form.append('photo', document.getElementById('photo').files[0]);
      console.log(form);
      updatedata(form, 'data');
    }
  }
});
