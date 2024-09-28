const express = require("express");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

// Route to classify text as 'ham' or 'spam'
app.post("/classify", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message text is required." });
  }

  // Define the path to your Python script
  const scriptPath = path.join(__dirname, "predict_spam.py");

  // Spawn a new child process to run the Python script
  const pythonProcess = spawn("python", [scriptPath, message]);

  // Handle any output from the Python script
  pythonProcess.stdout.on("data", (data) => {
    const label = data.toString().trim(); // Convert Buffer to string and trim whitespace
    console.log("Prediction from Python script:", label);

    // Convert the label to a boolean for spam
    const isSpam = label === "spam"; // true if spam, false if ham

    res.json({ spam: isSpam });
  });

  // Handle any errors
  pythonProcess.stderr.on("data", (data) => {
    console.error("Error from Python script:", data.toString());
    res.status(500).json({ error: "Error in Python script execution." });
  });

  // Handle process exit
  pythonProcess.on("exit", (code) => {
    if (code !== 0) {
      console.error(`Python process exited with code ${code}`);
      res.status(500).json({ error: "Python process exited with an error." });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
