init();

function init() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(MotionPathPlugin);
    animateLogoLetters();
    animateSolutionsText();
    // animateHeaderBee();
    animateHexGrid(document.getElementById('hex-grid-container'));
    animateHeroBg();
}

function animateHeroBg() {
    gsap.fromTo('.top-bg-inner', {
        backgroundPosition: 'center 20%'
    }, {
        backgroundPosition: 'center 80%',
        scrollTrigger: {
            trigger: '.top-bg-inner',
            markers: false,
            scrub: 2,
            start: 'top top',
            end: 'bottom 50%'
        }
    })
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

function animateHexGrid(elem) {
    drawHexGrid(elem);
    var polygon = elem.querySelectorAll('svg polygon');
    gsap.to(polygon, {
        keyframes: [
            { opacity: 1, duration: 1, ease: 'bounce.out' },
            { opacity: 0, duration: 3, ease: 'bounce.out' }
        ],
        stagger: {
            amount: 40,
            from: 'random',
            grid: 'auto',
            // axis: 'y',
            repeat: -1,
            repeatDelay: 20

        },
        scrollTrigger: {
            trigger: elem,
            //markers: true,
            toggleActions: 'play pause resume pause'
        },
    })

}

function drawHexGrid(elem) {
    var containerHeight = elem.offsetHeight;
    var containerWidth = elem.offsetWidth;

    var svg = elem.querySelector('svg');
    svg.setAttribute('viewBox', '-1 0 ' + containerWidth + ' ' + containerHeight);

    var triLen = 3;
    var hexHeight = 11 * triLen;
    var hexHeight27 = 3 * triLen; // about 27% of height
    var hexHeight72 = 8 * triLen; // about 72% of height
    var hexWidth = 6 * triLen * Math.sqrt(3);
    var hexWidthHalf = hexWidth / 2;

    var cols = Math.floor((containerWidth - hexWidth) / hexWidth);
    var rows = Math.floor((containerHeight - hexHeight72) / hexHeight72);
    for (var row = 0; row < rows; row++) {
        var offsetRow = row % 2;
        for (var col = 0; col < cols; col++) {
            drawHexagon(row, col, offsetRow);
        }
    }

    function drawHexagon(row, col, offsetRow) {
        var xOffset = col * hexWidth + hexWidthHalf;
        if (offsetRow) {
            xOffset += hexWidthHalf;
        }
        var yOffset = row * hexHeight72;

        // points are counterclockwise from top
        var p1 = [xOffset, yOffset].toString(); // top point
        var p2 = [xOffset + hexWidthHalf, yOffset + hexHeight27].toString();
        var p3 = [xOffset + hexWidthHalf, yOffset + hexHeight72].toString();
        var p4 = [xOffset, yOffset + hexHeight]; // bottom point
        var p5 = [xOffset - hexWidthHalf, yOffset + hexHeight72].toString();
        var p6 = [xOffset - hexWidthHalf, yOffset + hexHeight27].toString();

        var allPoints = p1 + ' ' + p2 + ' ' + p3 + ' ' + p4 + ' ' + p5 + ' ' + p6;
        var svgHex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        svgHex.setAttribute('points', allPoints);
        svgHex.setAttribute('data-row', row);
        svgHex.setAttribute('data-col', col);
        svg.appendChild(svgHex);
    }
}

function animateSolutionsText() {
    var t1 = gsap.timeline({
        repeat: -1,
        scrollTrigger: {
            trigger: '#contact',
            //markers: true,
            toggleActions: 'play pause resume pause'
        }
    });
    var solutions = document.querySelectorAll('.solution');
    gsap.set(solutions, { opacity: 0, display: 'none' });
    solutions.forEach(function tween(solution, i) {
        t1.fromTo(solution, { opacity: 0, display: 'none' }, { opacity: 1, display: 'block', yoyo: true, repeat: 1, duration: 1.5, ease: 'power' })
    });
}

function animateHeaderBee() {
    var t1 = gsap.timeline({
        scrollTrigger: {
            end: '50px top',
            markers: true,
            scrub: 1
        }
    });
    // todo: add flight path
    var p0 = { x: 75, y: -20 };
    var p1 = { x: 500, y: 300 }; // bottom left corner of build group
    t1.to('#logo-flying-hex', { opacity: 0, duration: 1 }, 0);
    t1.to('#logo-flying-bee', { opacity: 1, duration: 2 }, "<50%");
    t1.to('.header .logo-mark', { rotate: 90 }, 0);
    t1.to('.header .logo-mark', {
        motionPath: {
            path: '#bee-path path',
            align: '#bee-path path',
            xPercent: -50,
            yPercent: -50,
            transformOrigin: "50% 50%",
            autoRotate: 90
        },
        duration: 5
    }, 0)
}