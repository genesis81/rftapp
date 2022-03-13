

// mark navbar in specific colour
window.onload = function () {
    setTimeout(function() {
            var navbars = document.getElementsByClassName("navbar");
            if (navbars.length > 0) {
                    if (window.location.hostname.includes("rtf-test")) {
                            navbars[0].style.backgroundColor = "#d68080";
                    }
                    if (window.location.hostname.includes("192.168.150.115")) {
                            navbars[0].style.backgroundColor = "#008b00";
                    }
            }
    }, 500);
}