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
    var polygons = drawHexGrid(elem);
    var intervalId;
    ScrollTrigger.create({
        trigger: elem,
        // markers: true,
        onEnter: function () {
            clearInterval(intervalId);
            intervalId = setInterval(animatePolygons(polygons), 400);
        },
        onEnterBack: function () {
            clearInterval(intervalId);
            intervalId = setInterval(animatePolygons(polygons), 400);
        },
        onLeave: function () {
            clearInterval(intervalId);
        },
        onLeaveBack: function () {
            clearInterval(intervalId);
        }
    });
}

function animatePolygons(polygons) {
    var rowMax = polygons.length-1;
    var colMax = polygons[0].length-1;
    var row = gsap.utils.random(0, rowMax, 1);
    var col = gsap.utils.random(0, colMax, 1);
    return function () {
        row = getRandomIdx(row, 4, 0, rowMax);
        col = getRandomIdx(col, 2, 0, colMax);
        gsap.to(polygons[row][col], {
            keyframes: [
                { opacity: 1, duration: 1, ease: 'bounce.out' },
                { opacity: 0, duration: 3, ease: 'bounce.out' }
            ],
        })
    }
}

function getRandomIdx(idx, delta, min, max) {
    var idxMin = Math.max(min, idx-delta);
    var idxMax = Math.min(idx+delta, max);
    return gsap.utils.random(idxMin, idxMax, 1);
}


function drawHexGrid(elem) {
    var containerHeight = elem.offsetHeight;
    var containerWidth = elem.offsetWidth;

    var svg = elem.querySelector('svg');
    svg.setAttribute('viewBox', '-1 0 ' + containerWidth + ' ' + containerHeight);

    var hexDims = getHexDimensions(3);
    var cols = Math.floor((containerWidth - hexDims.hexWidth) / hexDims.hexWidth);
    var rows = Math.floor((containerHeight - hexDims.hexHeight72) / hexDims.hexHeight72);
    var hexArray = new Array(rows);
    for (var row = 0; row < rows; row++) {
        var offsetRow = row % 2;
        var colArr = [];
        for (var col = 0; col < cols; col++) {
            var svgHex = drawHexagon(row, col, offsetRow, hexDims);
            svg.appendChild(svgHex);
            colArr.push(svgHex);
        }
        hexArray[row] = colArr;
    }
    return hexArray;
}

function getHexDimensions(triLen){
    var hexWidth = 6 * triLen * Math.sqrt(3);
    return {
        hexHeight: 11 * triLen,
        hexHeight27: 3 * triLen, // about 27% of height
        hexHeight72: 8 * triLen, // about 72% of height
        hexWidth: hexWidth,
        hexWidthHalf: hexWidth / 2
    }
}

function drawHexagon(row, col, offsetRow, hexDims) {
    var hexWidthHalf = hexDims.hexWidthHalf;
    var hexHeight72 = hexDims.hexHeight72;
    var hexHeight27 = hexDims.hexHeight27;

    var xOffset = col * hexDims.hexWidth + hexWidthHalf;
    if (offsetRow) {
        xOffset += hexWidthHalf;
    }
    var yOffset = row * hexHeight72;

    // points are counterclockwise from top
    var p1 = [xOffset, yOffset].toString(); // top point
    var p2 = [xOffset + hexWidthHalf, yOffset + hexHeight27].toString();
    var p3 = [xOffset + hexWidthHalf, yOffset + hexHeight72].toString();
    var p4 = [xOffset, yOffset + hexDims.hexHeight]; // bottom point
    var p5 = [xOffset - hexWidthHalf, yOffset + hexHeight72].toString();
    var p6 = [xOffset - hexWidthHalf, yOffset + hexHeight27].toString();

    var allPoints = p1 + ' ' + p2 + ' ' + p3 + ' ' + p4 + ' ' + p5 + ' ' + p6;
    var svgHex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    svgHex.setAttribute('points', allPoints);
    svgHex.setAttribute('data-row', row);
    svgHex.setAttribute('data-col', col);
    return svgHex;
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
    var solutions = document.getElementById('contact').querySelectorAll('.solution');
    solutions.forEach(function tween(solution, i) {
        t1.to(solution, {
            opacity: 1,
            yoyo: true,
            repeat: 1,
            duration: 1.5,
            ease: 'power3'
        })
    });
}

function animateHeaderBee() {
    var t1 = gsap.timeline({
        scrollTrigger: {
            markers: true,
            scrub: 1,
            endTrigger: '#contact h1',
            end: 'bottom center'
        }
    });

    t1.to('#logo-flying-hex', { opacity: 0, duration: 1 }, 0);
    t1.to('#logo-flying-bee', { opacity: 1, duration: 2 }, "<50%");
    t1.to('#logo-flying', { rotation: 180 }, '<50%');

    var path1 = getBeeMotionPath(1);
    //addDebugBlocks(path1);
    t1.to('#logo-flying', {
        motionPath: {
            path: path1,
            autoRotate: 90
        },
        duration: 50
    }, '<');
    t1.to('#logo-flying', { rotation: 0, delay: 3 });
    // gsap.to('#logo-flying', {y: '+=4', repeat: 10, duration: 0.1});
}

function addDebugBlocks(path) {
    var debugBlocks = document.querySelectorAll('.debug-block'); // todo: add these dynamically
    gsap.set(debugBlocks, { opacity: 0 });
    var logo = document.querySelector('#header .logo');
    for (var i = 0, len = path.length; i < len; i++) {
        var div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.width = '40px';
        div.style.height = '42px';
        div.style.background = 'red';
        div.innerText = i;
        logo.prepend(div);
        gsap.set(div, path[i]);
    }
}

function getBeeMotionPath() {
    var flyingBeeElem = document.getElementById('logo-flying');
    var contentWidth = document.getElementById('header').querySelector('.content').clientWidth;
    var heroPoint = MotionPathPlugin.getRelativePosition(flyingBeeElem, document.querySelector('#hero .logo'), [0, 0], [0, 0.5]);
    var servicesPoint1 = MotionPathPlugin.getRelativePosition(flyingBeeElem, document.querySelector('#services-external h1 span'), [0, 0], [1, 0.5]);
    servicesPoint1.x += 10;
    var servicesPoint2 = MotionPathPlugin.getRelativePosition(flyingBeeElem, document.querySelector('#services-internal h1 span'), [0, 0], [1, 0.5]);
    servicesPoint2.x += 10;
    var contactPoint = MotionPathPlugin.getRelativePosition(flyingBeeElem, document.querySelector('#contact .button-primary'), [0, 0.5], [1, 0.5]);
    contactPoint.x += 20;

    var p1 = randomPointBetween({ x: 0, y: 0 }, { x: heroPoint.x + 100, y: heroPoint.y });
    var p2 = randomPointBetween({ x: 0, y: heroPoint.y }, { x: contentWidth, y: servicesPoint1.y });
    var p3 = randomPointBetween({ x: 0, y: heroPoint.y }, { x: contentWidth, y: servicesPoint1.y });
    var p4 = randomPointBetween({ x: 0, y: servicesPoint1.y }, { x: contentWidth, y: servicesPoint2.y });
    var p5 = randomPointBetween({ x: 0, y: servicesPoint1.y }, { x: contentWidth, y: servicesPoint2.y });
    var p6 = randomPointBetween(servicesPoint2, contactPoint);
    var p7 = randomPointBetween(servicesPoint2, contactPoint);

    return [p1, heroPoint, p2, p3, servicesPoint1, p4, p5, servicesPoint2, p6, p7, contactPoint];
}

function randomPointBetween(a, b) {
    return {
        x: gsap.utils.random(a.x, b.x),
        y: gsap.utils.random(a.y, b.y)
    }
}

function callAfterResize(func, delay) {
    let dc = gsap.delayedCall(delay || 0.2, func).pause(),
        handler = () => dc.restart(true);
    window.addEventListener("resize", handler);
    return handler; // in case you want to window.removeEventListener() later
}

// reusable function. Feed in an array and an ease and it'll return
// a function that pulls a random element from that array, weighted
// according to the ease you provide.
function weightedRandom(collection, ease) {
    return gsap.utils.pipe(
        Math.random,            //random number between 0 and 1
        gsap.parseEase(ease),   //apply the ease
        gsap.utils.mapRange(0, 1, -0.5, collection.length - 0.5), //map to the index range of the array, stretched by 0.5 each direction because we'll round and want to keep distribution (otherwise linear distribution would be center-weighted slightly)
        gsap.utils.snap(1),     //snap to the closest integer
        i => collection[i]      //return that element from the array
    );
}
