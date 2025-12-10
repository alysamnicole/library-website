/* ------------------------------------------------------------
   CAROUSEL SCRIPT
   Handles:
   - Automatic sliding
   - Next/prev arrows
   - Dot indicators
------------------------------------------------------------ */

// Tracks which slide is currently showing
let slideIndex = 0;

// Select all slide elements
const slides = document.querySelectorAll(".slide");

// Dot container (empty — dots will be added by JS)
const dotsContainer = document.querySelector(".dots");

/* ------------------------------------------------------------
   CREATE DOTS DYNAMICALLY (one for each slide)
------------------------------------------------------------ */
slides.forEach((_, i) => {
  const dot = document.createElement("span");

  // When a dot is clicked, move to that slide
  dot.addEventListener("click", () => goToSlide(i));

  dotsContainer.appendChild(dot);
});

// Select the dots after creating them
const dots = document.querySelectorAll(".dots span");

// Highlight the first dot initially
dots[0].classList.add("active-dot");

/* ------------------------------------------------------------
   FUNCTION: Display a slide based on index
------------------------------------------------------------ */
function showSlide(index) {
  // Wraps around if index is out of bounds (infinite loop effect)
  slideIndex = (index + slides.length) % slides.length;

  // Move slides container using translateX
  document.querySelector(".slides").style.transform = `translateX(-${
    slideIndex * 100
  }%)`;

  // Update dot indicators
  dots.forEach((dot) => dot.classList.remove("active-dot"));
  dots[slideIndex].classList.add("active-dot");
}

/* ------------------------------------------------------------
   NEXT + PREVIOUS SLIDE FUNCTIONS
------------------------------------------------------------ */
function nextSlide() {
  showSlide(slideIndex + 1);
}

function prevSlide() {
  showSlide(slideIndex - 1);
}

/* ------------------------------------------------------------
   ARROW BUTTON EVENT LISTENERS
------------------------------------------------------------ */
document.querySelector(".arrow.right").addEventListener("click", nextSlide);
document.querySelector(".arrow.left").addEventListener("click", prevSlide);

/* ------------------------------------------------------------
   AUTO-SLIDE: Change slide every 5 seconds
------------------------------------------------------------ */
setInterval(nextSlide, 5000);

/* ------------------------------------------------------------
   JUMP TO SPECIFIC SLIDE (clicking a dot)
------------------------------------------------------------ */
function goToSlide(n) {
  showSlide(n);
}

fetch("data/library_books.csv")
  .then((response) => response.text())
  .then((csv) => {
    const rows = csv.split("\n").slice(1, 46); // first 45 books
    const gallery = document.querySelector(".book-gallery");

    rows.forEach((row, index) => {
      const parts = row.split(",");

      const title = parts[0];
      const author = parts[1];
      const description = parts[2];
      const rating = parts[3];

      // handle jpg/jpeg inconsistency
      let imgPathJpg = `assets/images/book${index + 1}.jpg`;
      let imgPathJpeg = `assets/images/book${index + 1}.jpeg`;

      // Create the book wrapper div
      const bookDiv = document.createElement("div");
      bookDiv.classList.add("book-item");

      bookDiv.innerHTML = `
                    <img src="${imgPathJpg}" onerror="this.onerror=null; this.src='${imgPathJpeg}'" />
                    <div class="popup">
                        <strong>${title}</strong><br>
                        ${author}<br><br>
                        ${description}<br><br>
                        ⭐ Rating: ${rating}
                    </div>
                    <button class="checkout-btn">Check Out</button>
                `;

      gallery.appendChild(bookDiv);
    });
  })
  .catch((err) => console.error("Book CSV failed to load:", err));

/* ------------------------------------------------------------
   SEARCH FUNCTION
------------------------------------------------------------ */
document.getElementById("searchInput").addEventListener("input", function () {
    const value = this.value.toLowerCase();
    const books = document.querySelectorAll(".book-item");

    books.forEach(book => {
        const title = book.querySelector(".popup strong").innerText.toLowerCase();
        const author = book.querySelector(".popup").innerText.toLowerCase();

        if (title.includes(value) || author.includes(value)) {
            book.style.display = "block";
        } else {
            book.style.display = "none";
        }
    });
});

