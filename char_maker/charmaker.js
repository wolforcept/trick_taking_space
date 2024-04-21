// UTILS
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}


const colors = ['#369CEB', '#fbd13d', '#e65353', '#4dc82c', '#181818'];
const colors2 = ['#9CF', '#fad861', '#f68484', '#78de5c', '#303030'];
const hairColors = ['#432406', '#5b340e', '#855221', '#331408', '#4d2312', '#6d331c', '#8c4f37', '#8c6537', '#b8864b', '#d9b360', '#d99c60', '#d98860', '#b4582a', '#a1491d', '#883005', '#9a3300', '#9a2400', '#b12a00', '#711b00',
    // weird colors:
    '#b41777', '#8217b4', '#17b2b4', '#238f14', '#0c26e8', '#0ce835'];
const nrBacks = 6;
const nrHeads = 8;
const nrHairs = 36;
const nrHairColors = hairColors.length;
const nrFaces = 23;
const nrBodies = 8;
const nrColors = colors.length;
const lockeds = [false, false, false, false, false, false, false, false, false, false, false, false,]

function setImg(id, file) {
    $('#' + id).empty();
    $('#' + id).
        // attr('data-src', `./svg/${nr}/svg-image-${id}.svg`);
        // append($(`<object data="./svg/${nr}/svg-image-${id}.svg">`));
        append($(`<svg data-src="./assets/${file}.svg">`));
}

function makeChanger(length, callback) {
    let value = 0;
    callback(value);
    return (v) => {
        if (v === 0) return value;
        if (v === null) return callback(value);
        if (v === undefined) v = Math.floor(Math.random() * 100000);
        value += v;
        value %= length;
        if (value >= length)
            value = 0;
        if (value < 0)
            value = length - 1;
        callback(value);
        return value;
    }
}

function changeLocked(id, element) {
    lockeds[id] = element.checked;
}

function randomize() {
    if (!lockeds[0])
        changeBack();
    if (!lockeds[1])
        changeHead();
    if (!lockeds[2])
        changeHair();
    if (!lockeds[3])
        changeHairColor();
    if (!lockeds[4])
        changeFace();
    if (!lockeds[5])
        changeBody();
    if (!lockeds[6])
        changeColor();
}

const changeBack = makeChanger(nrBacks, (value) => {
    $('#background').attr('src', `assets/backs/${value}.png`)
    $('#back').html('Back ' + value);
});

const changeHead = makeChanger(nrHeads, (value) => {
    setImg('headA', 'heads/' + value + 'a');
    setImg('headB', 'heads/' + value + 'b');
    $('#head').html('Head ' + value);
});

const changeHair = makeChanger(nrHairs, (value) => {
    setImg('hairA', 'hairs/' + value + 'a');
    setImg('hairB', 'hairs/' + value + 'b');
    $('#hair').html('Hair ' + value);
    setTimeout(() => changeHairColor(null), 10);
});

const changeHairColor = makeChanger(nrHairColors, (value) => {
    $('#hairA').find('svg').attr('fill', hairColors[value]);
    $('#hairColor').html('Hair Color ' + value);
});

const changeFace = makeChanger(nrFaces, (value) => {
    setImg('faceA', 'faces/' + value + 'a');
    setImg('faceB', 'faces/' + value + 'b');
    $('#face').html('Face ' + value);
});

const changeBody = makeChanger(nrBodies, (value) => {
    setImg('bodyA', 'bodies/' + value + 'a');
    setImg('bodyB', 'bodies/' + value + 'b');
    setImg('bodyC', 'bodies/' + value + 'c');
    $('#body').html('Body ' + value);
    setTimeout(() => changeColor(null), 10);
});

const changeColor = makeChanger(nrColors, (value) => {
    $('path', $(`#bodyC`)).each(function () {
        const fill = $(this).attr('fill');
        if (fill === '#369CEB' || colors.includes(fill))
            $(this).attr('fill', colors[value]);
        if (fill === '#9CF' || colors2.includes(fill))
            $(this).attr('fill', colors2[value]);
    });
    $('#color').html('Color ' + value);
})

// ██▀ ▀▄▀ █▀▄ ▄▀▄ █▀▄ ▀█▀ 
// █▄▄ █ █ █▀  ▀▄▀ █▀▄  █  

const exportWidth = 816;
const exportHeight = 1110;

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function exportt() {

    const canvas = $(`<canvas width="${exportWidth}" height="${exportHeight}">`);
    $('body').append(canvas);
    setTimeout(async () => {

        const backImg = await loadImage(`assets/backs/${changeBack(0)}.png`);
        const bodyA = await loadImage(`assets/bodies/${changeBody(0)}a.svg`);
        const bodyB = await loadImage(`assets/bodies/${changeBody(0)}b.svg`);
        const svgURLbodyC = new XMLSerializer().serializeToString($('#bodyC').find('svg')[0]);
        const bodyC = await loadImage('data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgURLbodyC));
        const headA = await loadImage(`assets/heads/${changeHead(0)}a.svg`);
        const headB = await loadImage(`assets/heads/${changeHead(0)}b.svg`);
        const faceA = await loadImage(`assets/faces/${changeFace(0)}a.svg`);
        const faceB = await loadImage(`assets/faces/${changeFace(0)}b.svg`);
        // const hairA = await loadImage(`assets/hairs/${changeHair(0)}a.svg`);
        const hairB = await loadImage(`assets/hairs/${changeHair(0)}b.svg`);
        const svgURLhairB = new XMLSerializer().serializeToString($('#hairA').find('svg')[0]);
        const hairA = await loadImage('data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgURLhairB));

        await Promise.all([backImg, bodyA, bodyB, bodyC, headA, headB, faceA, faceB, hairA, hairB]);

        var ctx = canvas[0].getContext('2d');

        const dX = -(exportHeight - exportWidth) / 2;
        const dY = 150;
        ctx.drawImage(backImg, dX, dY, exportHeight, exportHeight);
        ctx.drawImage(bodyA, dX, dY, exportHeight, exportHeight);
        ctx.drawImage(bodyB, dX, dY, exportHeight, exportHeight);
        ctx.drawImage(bodyC, dX, dY, exportHeight, exportHeight);
        ctx.drawImage(headA, dX, dY, exportHeight, exportHeight);
        ctx.drawImage(headB, dX, dY, exportHeight, exportHeight);
        ctx.drawImage(faceA, dX, dY, exportHeight, exportHeight);
        ctx.drawImage(faceB, dX, dY, exportHeight, exportHeight);
        ctx.drawImage(hairA, dX, dY, exportHeight, exportHeight);
        ctx.drawImage(hairB, dX, dY, exportHeight, exportHeight);

        downloadFile("person.png", canvas[0].toDataURL("image/png"));
        canvas.remove();
    }, 1000)
}

function downloadFile(name, dataStr) {
    let a = $(`<a style="color:white;" download="${name}" href="${dataStr}">${name}</a>`)
    $('body').append(a);
    a[0].click();
    a.remove();
    // a.trigger('click');
}

// function next(i, v) {
//     nr[i] += v;
//     if (nr[i] >= maxNr)
//         nr[i] = 0;
//     if (nr[i] < 0)
//         nr[i] = maxNr - 1;
//     setImg(i, nr[i]);
// }

// let back = 0;
// const backsLength = 5;
// function changeBack(v) {
//     back += v;
//     if (back >= backsLength)
//         back = 0;
//     if (back < 0)
//         back = backsLength - 1;
//     $('#background').attr('src', `assets/backs/${back}.png`)
// }

// let head = 0;
// const headsLength = 8;
// function changeHead(v) {
//     next(14, v);
//     next(15, v);
//     $('#head').html('Head ' + nr[14])
// }

// function changeHair(v) {
//     next(18, v);
//     next(19, v);
//     $('#hair').html('Hair ' + nr[18])
// }

// function changeFace(v) {
//     next(16, v);
//     next(17, v);
//     $('#face').html('Face ' + nr[16])
// }

// function changeBody(v) {
//     next(11, v);
//     next(12, v);
//     next(13, v);
//     $('#body').html('Body ' + nr[11]);
//     setTimeout(() => {
//         changeColor(0);
//     }, 10)
// }

// function changeColor(v) {
//     console.log('changeColor' + color)
//     color += v;
//     if (color >= colors.length)
//         color = 0;
//     if (color < 0)
//         color = colors.length - 1;
//     $('path', $(`#13`)).each(function () {
//         const fill = $(this).attr('fill');
//         if (fill === '#369CEB' || colors.includes(fill))
//             $(this).attr('fill', colors[color]);
//         if (fill === '#9CF' || colors2.includes(fill))
//             $(this).attr('fill', colors2[color]);
//     });
//     $('#color').html('Color ' + color);
// }
