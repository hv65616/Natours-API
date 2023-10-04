const getoverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'All tours',
  });
};
const gettour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forset Hiker',
  });
};
module.exports = { getoverview,gettour };
