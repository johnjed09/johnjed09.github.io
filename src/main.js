import "./stylesheets/main.scss";

// Show floating button when scrolling down.
let floatingButton = document.getElementsByClassName("floating-dock")[0];
window.onscroll = function () {
  scrollFunction();
};
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    floatingButton.style.display = "block";
  } else {
    floatingButton.style.display = "none";
  }
}

// Add eventlisteners for contact-me images.
const imgLinks = document.getElementsByClassName("copy-paste__links")[0];
for (var i = 0; i < imgLinks.childElementCount; i++) {
  var img = imgLinks.getElementsByTagName("img")[i];

  img.addEventListener("click", copyLinkFromImg);

  img.addEventListener("onmouseout", function () {
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copy to clipboard";
  });
}

// Copy contact details from img to clipboard
function copyLinkFromImg() {
  var imgDesc = this.getAttribute("longdesc");

  // Create a dummy input to copy the string array inside it
  var dummy = document.createElement("input");

  // Add it to the document
  document.body.appendChild(dummy);

  // Set its ID
  dummy.setAttribute("id", "dummy_id");

  // Output the array into it
  document.getElementById("dummy_id").value = imgDesc;

  // Select it
  dummy.select();

  // Copy its contents
  document.execCommand("copy");

  for (var i = 0; i < imgLinks.childElementCount; i++) {
    var img = imgLinks.getElementsByTagName("img")[i];
    var toolTip = img.previousElementSibling;

    if (img === this) toolTip.innerHTML = "Copied to clipboard.";
  }

  // Remove it as its not needed anymore
  document.body.removeChild(dummy);
}

// Scroll to each section of the page
const scrollButtons = document.querySelectorAll(".btnNextSection");
scrollButtons.forEach((button) =>
  button.addEventListener("click", function (event) {
    event.preventDefault();

    const targetSelector = this.dataset.target;
    const targetSection = document.querySelector(targetSelector);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }),
);
