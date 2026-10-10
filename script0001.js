document.addEventListener("DOMContentLoaded", () => {
  // ---------------- FAN BUTTON LOGIC ----------------
  let fanUsers = parseInt(localStorage.getItem("fanUsers")) || 0;
  let fanClicks = parseInt(localStorage.getItem("fanClicks")) || 0;

  document.getElementById("fanUsers").innerText = fanUsers;
  document.getElementById("fanClicks").innerText = fanClicks;

  const fanBtn = document.getElementById("fanBtn");
  fanBtn.addEventListener("click", () => {
    fanClicks++;
    localStorage.setItem("fanClicks", fanClicks);
    document.getElementById("fanClicks").innerText = fanClicks;

    if (!localStorage.getItem("fanID")) {
      fanUsers++;
      localStorage.setItem("fanUsers", fanUsers);
      localStorage.setItem("fanID", Date.now());
      document.getElementById("fanUsers").innerText = fanUsers;
    }
  });

  // ---------------- RATING SYSTEM ----------------
  let selectedStars = 0;
  const stars = document.querySelectorAll(".rating .star");

  // Average Rating display (public)
  const avgDisplay = document.createElement("p");
  avgDisplay.id = "avgRating";
  avgDisplay.innerText = "Average Rating: 0 / 5";
  document.querySelector(".rating").appendChild(avgDisplay);

  // Reviews list (private — sirf tumhare liye)
  const reviewList = document.createElement("div");
  reviewList.id = "reviewList";
  reviewList.innerHTML = "<h4>My Private Reviews:</h4>";
  document.querySelector(".rating").appendChild(reviewList);

  // Load ratings + reviews
  let ratings = JSON.parse(localStorage.getItem("ratings")) || [];
  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

  function updateAverage() {
    if (ratings.length === 0) {
      avgDisplay.innerText = "Average Rating: 0 / 5";
      return;
    }
    let sum = ratings.reduce((a, b) => a + b, 0);
    let avg = (sum / ratings.length).toFixed(1);
    avgDisplay.innerText = "Average Rating: " + avg + " / 5";
  }

  function updateReviews() {
    // Sirf tumhare browser me dikhai denge
    if (reviews.length === 0) {
      reviewList.innerHTML = "<h4>My Private Reviews:</h4><p>No reviews yet.</p>";
      return;
    }
    reviewList.innerHTML = "<h4>My Private Reviews:</h4>";
    reviews.forEach((r) => {
      let p = document.createElement("p");
      p.innerText = "⭐ " + r.stars + " / 5 — " + r.text;
      reviewList.appendChild(p);
    });
  }

  updateAverage();
  updateReviews();

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      selectedStars = index + 1;
      document.getElementById("selectedStars").innerText = selectedStars;

      stars.forEach((s, i) => {
        s.style.color = i < selectedStars ? "orange" : "gold";
      });
    });
  });

  const submitBtn = document.getElementById("submitReview");
  submitBtn.addEventListener("click", () => {
    if (selectedStars === 0) {
      alert("Please select stars before submitting!");
      return;
    }

    let reviewText = document.getElementById("reviewText").value;

    // Save rating + review
    ratings.push(selectedStars);
    reviews.push({ stars: selectedStars, text: reviewText || "No review written" });

    localStorage.setItem("ratings", JSON.stringify(ratings));
    localStorage.setItem("reviews", JSON.stringify(reviews));

    updateAverage();
    updateReviews();

    // Reset
    selectedStars = 0;
    document.getElementById("selectedStars").innerText = 0;
    document.getElementById("reviewText").value = "";
    stars.forEach((s) => {
      s.style.color = "gold";
    });
  });
});
