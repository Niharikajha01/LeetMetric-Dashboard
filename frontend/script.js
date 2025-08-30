document.getElementById("search-btn").addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  if (!username) {
    alert("⚠️ Please enter a username");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/user/${username}`);
    const data = await response.json();

    // Update progress bars
    document.querySelector(".easy-progress").style.width = `${(data.easySolved / 500) * 100}%`;
    document.querySelector(".medium-progress").style.width = `${(data.mediumSolved / 500) * 100}%`;
    document.querySelector(".hard-progress").style.width = `${(data.hardSolved / 500) * 100}%`;

    document.getElementById("easy-count").textContent = data.easySolved;
    document.getElementById("medium-count").textContent = data.mediumSolved;
    document.getElementById("hard-count").textContent = data.hardSolved;
  } catch (error) {
    console.error("Error fetching data:", error);
    alert(" Failed to fetch user data. Make sure backend is running.");
  }
});
