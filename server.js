const express = require("express");
const dotenv = require("dotenv");
const app = express();
const authRoutes = require("./routes/auth.js");
const candidaturesRoutes = require('./routes/candidatures');
const missionsRoutes = require('./routes/missions.js');

dotenv.config();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Trouve ton emploi !");
});

app.use("/auth", authRoutes);
app.use('/candidatures', candidaturesRoutes);
app.use('/missions', missionsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});