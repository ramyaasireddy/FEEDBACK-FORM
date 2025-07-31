document.getElementById("feedbackForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const feedback = document.getElementById("feedback").value.trim();
  if (!username || !feedback) return;

  const entry = {
    username,
    feedback,
    date: new Date().toLocaleString(),
    id: Date.now()
  };

  let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  feedbacks.push(entry);
  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

  showToast();
  this.reset();
  renderFeedbacks();
});

function showToast() {
  const toast = document.getElementById("toast");
  toast.className = "toast show";
  setTimeout(() => toast.className = "toast", 3000);
}

function renderFeedbacks() {
  const list = document.getElementById("feedbackList");
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  list.innerHTML = "";

  feedbacks.forEach(fb => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${fb.username}</strong> (${fb.date})<br>${fb.feedback}
      <button onclick="deleteFeedback(${fb.id})">Delete</button>`;
    list.appendChild(li);
  });
}

function deleteFeedback(id) {
  let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  feedbacks = feedbacks.filter(fb => fb.id !== id);
  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
  renderFeedbacks();
}

function exportToCSV() {
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  let csvContent = "data:text/csv;charset=utf-8,Name,Feedback,Date\n";

  feedbacks.forEach(fb => {
    csvContent += `${fb.username},${fb.feedback.replace(/,/g, ";")},${fb.date}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "feedback_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

renderFeedbacks();
