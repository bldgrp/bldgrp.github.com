init();

function init() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(MotionPathPlugin);
    animateLogoLetters();
    animateSolutionsText();
    animateHeaderBee();
    // animateLogoTriangles();
    animateHexGrid(document.getElementById('hex-grid-container'));
}

function animateLogoLetters() {
    gsap.from('.logo-letter', {
        rotation: "random(-360, 360)",
        x: "random(-60,60)",
        y: "random(-60,60)",
        duration: 1,
        delay: 0.5,
        ease: 'bounce.out'
    })
}

function animateLogoTriangles() {

}

function animateHexGrid(elem) {
    drawHexGrid(elem);
}

function drawHexGrid(elem) {
    var containerHeight = elem.offsetHeight;
    var containerWidth = elem.offsetWidth;

    var svg = elem.querySelector('svg');
    svg.setAttribute('fill', 'none')
    svg.setAttribute('stroke', '#ffd942');
    svg.setAttribute('viewBox', '0 0 ' + containerWidth + ' ' + containerHeight);
    
    var triLen = 3;
    var hexVertSideLen = 5*triLen;
    var hexVertSideLenHalf = hexVertSideLen/2;
    var hexHeightHalf = 11*triLen/2;
    var hexHeight72 = hexVertSideLen + 6*triLen/2; // about 72% of height
    var hexWidth= 6*triLen*Math.sqrt(3);
    var hexWidthHalf = hexWidth/2;

    var cols = Math.ceil(containerWidth / hexWidth);
    var rows = Math.ceil(containerHeight / hexHeight72);

    for (var row = 0; row < rows; row++) {
        var startRowWithFullHex = row % 2;
        for (var col = 0; col < cols; col++) {
            drawHexagon(row, col, startRowWithFullHex);
        }
    }
    
    function drawHexagon(row, col, startRowWithFullHex) {
        var xOffset = col*hexWidth;
        if (startRowWithFullHex) {
            xOffset += hexWidthHalf;
        }
        var yOffset = row*(hexHeight72)-hexVertSideLenHalf;
        
        // points are counterclockwise from top
        var p1 = [xOffset, yOffset - hexHeightHalf].toString(); // top point
        var p2 = [xOffset + hexWidthHalf, yOffset - hexVertSideLenHalf].toString(); 
        var p3 = [xOffset + hexWidthHalf, yOffset + hexVertSideLenHalf].toString();
        var p4 = [xOffset, yOffset + hexHeightHalf]; // bottom point
        var p5 = [xOffset - hexWidthHalf, yOffset + hexVertSideLenHalf].toString();
        var p6 = [xOffset - hexWidthHalf, yOffset - hexVertSideLenHalf].toString();
    
        var allPoints = p1 + ' ' + p2 + ' ' + p3 + ' ' + p4 + ' ' + p5 + ' ' + p6;
        var svgHex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        svgHex.setAttribute('points', allPoints);
        svg.appendChild(svgHex);
    }    
}

function animateSolutionsText() {
    var t1 = gsap.timeline({ repeat: -1, scrollTrigger: { trigger: '#contact' } });
    var solutions = document.querySelectorAll('.solution');
    solutions.forEach(function tween(solution, i) {
        t1.fromTo(solution, { opacity: 0 }, { opacity: 1, yoyo: true, repeat: 1, duration: 1.5, ease: 'power' })
    });
}

function animateHeaderBee() {
    var t1 = gsap.timeline({
        scrollTrigger: {
            end: '50px top',
            //markers:true,
            scrub: 1
        }
    });
    // todo: add flight path
    var p0 = { x: 75, y: -20 };
    var p1 = { x: 500, y: 300 }; // bottom left corner of build group
    t1.to('#logo-flying-hex', { opacity: 0, duration: 1 }, 0);
    t1.to('#logo-flying-bee', { opacity: 1, duration: 2 }, "<50%");
    // t1.to('.header .logo-mark', {rotate: 90}, 0);
    // t1.to('.header .logo-mark', {
    //     motionPath: {
    //         path: [p0, p1],
    //         xPercent: -50,
    //         yPercent: -50,
    //         transformOrigin: "50% 50%",
    //         autoRotate:90
    //     },
    //     duration: 5
    // }, "<50%")
}