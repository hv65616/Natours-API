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
      alert('Logged In Suceess');
      window.setTimeout(() => {
        location.assign('/overview');
      }, 1500);
    }
    console.log('Hello from login try');
    // console.log(res);
  } catch (error) {
    alert(error.response.data.message);
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
