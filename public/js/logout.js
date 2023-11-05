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

document.querySelector('.nav__el--logout').addEventListener('click', logout);
