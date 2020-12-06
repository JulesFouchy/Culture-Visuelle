/* Svg scroll effect */

drawOnScroll = () => {

    var path = document.querySelector(".myPath");
    var path2 = document.querySelector(".myPath2");
    var path3 = document.querySelector(".myPath3");

    var length = path.getTotalLength();
    var length2 = path2.getTotalLength();
    var length3 = path3.getTotalLength();

    // The start position of the drawing
    path.style.strokeDasharray = length;
    path2.style.strokeDasharray = length2;
    path3.style.strokeDasharray = length3;
    // Hide the path by offsetting dash. Remove this line to show the path before scroll draw
    path.style.strokeDashoffset = length;
    path2.style.strokeDashoffset = length2;
    path3.style.strokeDashoffset = length3;

    // Find scroll percentage on scroll (using cross-browser properties), and offset dash same amount as
    // percentage scrolled
    window.addEventListener("scroll", fillOnScroll);

    function fillOnScroll() {
        // This long calculation is just needed to find out the percentage of the webpage that has been scrolled.
        // You don't need to worry about it much. Can be used as is all the time.
        var scrollpercent = (document.body.scrollTop + document.documentElement.scrollTop) /
            (document.documentElement.scrollHeight - document.documentElement.clientHeight);
        // var scrollpercent = (document.body.scrollTop + document.documentElement.scrollTop) /
        // (document.documentElement.clientHeight);

        // Sets draw to (the progress of scroll multiplied by the length) to find exact offset.
        var draw = length * (scrollpercent*12);
        var draw2 = length2 * (scrollpercent*12);
        var draw3 = length3 * (scrollpercent*12);
            
        // In downward scroll, simply decreases the strokeDashOffset gradually towards zero.
        // Reverse the drawing (when scrolling upwards)
        path.style.strokeDashoffset = length - draw;
        path2.style.strokeDashoffset = length2 - draw2;
        path3.style.strokeDashoffset = length3 - draw3;
    }
}     

// Invoking the function once so that it set ups the event listener for scroll.
drawOnScroll();
