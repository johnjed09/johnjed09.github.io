//Get the button:
floatingButton = document.getElementsByClassName('floating-dock')[0];

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
   floatingButton.style.display = "block";
  } else {
   floatingButton.style.display = "none";
  }
}


const imgLinks = document.getElementsByClassName('copy-paste__links')[0];

//initialize all eventlisteners in the DOM
for (var i = 0; i < imgLinks.childElementCount; i++) {
   var img = imgLinks.getElementsByTagName("img")[i];

   img.addEventListener("click", copyLinkFromImg);

   img.addEventListener("onmouseout", function () {
      var tooltip = document.getElementById("myTooltip");
      tooltip.innerHTML = "Copy to clipboard";
   });
}

//copy longdesc attribute from img to clipboard
function copyLinkFromImg() {
   imgDesc = this.getAttribute('longdesc');

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

      if (img === this)
         toolTip.innerHTML = "Copied: " + dummy.value;
   }

   // Remove it as its not needed anymore
   document.body.removeChild(dummy);
}

//scoll on each section of the page
function pageScroller(page) {
   // Scroll to a certain element
   document.querySelector(page).scrollIntoView({
      behavior: 'smooth'
   });
}
