document.addEventListener("DOMContentLoaded", function () {
  const reader = document.getElementById("reader");
  const pageImage = document.getElementById("pageImage");
  const pages = JSON.parse(reader.dataset.pages);

  let currentPage = 0;

  reader.addEventListener("click", () => {
    currentPage++;
    if (currentPage >= pages.length) currentPage = 0;
    pageImage.src = pages[currentPage];
  });
});
