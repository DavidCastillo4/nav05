//server.js
let port = 3201;
let express = require("express");
let cors = require("cors");
let jwt = require("jsonwebtoken");
let app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

let jwtKey = 'secretEnvString';
let versionPk = 0;
let tokens = [];

app.post('/authenticate', async (req, res) => {
 versionPk++;
 let bodyData = await req.body;
 if (bodyData.name === "a" && bodyData.passWord === "a") {
  let token = jwt.sign(
   {
    userPk: 101
    , name: "a"
    , favColor: "brown"
    , versionPk: versionPk
   }
   , jwtKey
   , { expiresIn: '2s' });
  tokens.push(token)
  //console.log(tokens)
  res.send({ status: 1, token: token })
 }
 else { res.send({ 'status': 0 }) }
});

app.get('/authorize', (req, res) => {
 let headerData = req.headers;
 let statusPk = 0;
 jwt.verify(headerData.token, jwtKey, function (err, decoded) {
  if (err) {
   statusPk = 0;
   console.log(err.name, err.expiredAt)
  }
  else {
   /*Only keep current version.
   Check for older (non-expired) versions*/
   decoded.versionPk === versionPk ? statusPk = 1 : statusPk = 0;
   console.log(decoded.versionPk)
  }
  res.send({ status: statusPk });
 })
});

app.listen(port, () => { console.log(`Listening on ${port}`); });

