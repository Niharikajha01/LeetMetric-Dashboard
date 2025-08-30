const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/user/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        "Referer": `https://leetcode.com/${username}/`,
      },
      body: JSON.stringify({
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                  submissions
                }
              }
            }
          }
        `,
        variables: { username },
      }),
    });

    const data = await response.json();

    if (!data.data || !data.data.matchedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const stats = data.data.matchedUser.submitStats.acSubmissionNum;

    const easySolved = stats.find(s => s.difficulty === "Easy")?.count || 0;
    const mediumSolved = stats.find(s => s.difficulty === "Medium")?.count || 0;
    const hardSolved = stats.find(s => s.difficulty === "Hard")?.count || 0;
    const totalSolved = easySolved + mediumSolved + hardSolved;

    res.json({
      username,
      easySolved,
      mediumSolved,
      hardSolved,
      totalSolved,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
