 document.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => {
        document.getElementById("puzzle-loader").classList.add("fade-out");
        setTimeout(() => {
          document.getElementById("puzzle-loader").style.display = "none";
          document.body.style.overflow = "auto";
        }, 1000);
      }, 5000);
    });