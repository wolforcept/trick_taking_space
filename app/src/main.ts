function shuffle<T>(array: Array<T>): Array<T> {
    let currentIndex = array.length;
    let randomIndex: number;
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

const symbols = ['A', 'B', 'C', 'D', 'E', 'G', 'F'];

let answer, currentSymbols, restOfSymbols;

function initCode() {
    restOfSymbols = shuffle([...symbols]);
    currentSymbols = [...restOfSymbols.splice(0, 4)];
    answer = shuffle([...symbols]).splice(0, 4);
}

const droppableOptions: JQueryUI.DroppableOptions = {
    drop: function (ev, ui) {
        $(this).find(".card").detach().appendTo($(ui.draggable).parent());
        $(ui.draggable).detach().css({ top: 0, left: 0 }).appendTo(this);
    }
};
const draggableOptions: JQueryUI.DraggableOptions = { revert: "invalid" };

function createCardDivs() {
    for (let i = 0; i < currentSymbols.length; i++) {
        const letterIndex = i;
        const card = $(`<div class="card"><img src="assets/symbol_${currentSymbols[i]}.svg"></div>`);
        card.attr("codeValue", currentSymbols[i]);
        $(`#current_` + i).append(card);
        card.draggable(draggableOptions);
    }

    for (let i = 0; i < restOfSymbols.length; i++) {
        const card = $(`<div class="card"><img src="assets/symbol_${restOfSymbols[i]}.svg"></div>`);
        card.attr("codeValue", restOfSymbols[i]);
        $(`#rest_` + i).append(card);
        card.draggable(draggableOptions);
    }
}

var isVisible = true;
function toggleArrow() {
    isVisible = !isVisible;
    if (isVisible) {
        $("#arrow").removeClass("small");
        $("#rest").show("blind");
    } else {
        $("#arrow").addClass("small");
        $("#rest").hide("blind");
    }
}

function get(i: number) {
    const div = $("#current_" + i).find(".card");
    return div.attr("codeValue");
}

function checkCode(code: string[]) {
    let corrects = 0;
    let misses = 0;
    let fails = 0;
    code.forEach(letter => {
        if (answer.includes(letter)) {

            const posOfLetterInCode = code.indexOf(letter);
            const posOfLetterInAnswer = answer.indexOf(letter);
            if (posOfLetterInCode == posOfLetterInAnswer) {
                corrects++;
            } else {
                misses++;
            }
        } else {
            fails++;
        }
    });
    return { corrects, misses, fails };
}

function check() {
    const currCode = [get(0), get(1), get(2), get(3)];

    const { corrects, misses, fails } = checkCode(currCode);

    const left = $(`<span class="left"></span>`);
    const mid = $(`<span class="middle">→</span>`);
    const right = $(`<span class="right"></span>`);
    const nr = $(`<div class="number">${$('#attempts').children().length + 1}</div>`);
    const div = $(`<div class="attempt"></div>`);

    currCode.forEach(letter => {
        left.append($(`<img src="assets/symbol_${letter}.svg">`))
    })

    for (let i = 0; i < corrects; i++)
        right.append($(`<img src="assets/circle_green.svg">`))
    for (let i = 0; i < misses; i++)
        right.append($(`<img src="assets/circle_yellow.svg">`))
    for (let i = 0; i < fails; i++)
        right.append($(`<img src="assets/circle_red.svg">`))

    div.append([left, mid, right, nr]);
    $("#attempts").prepend(div);
    // console.log({ corrects, misses, fails });
}

$('.drop').droppable(droppableOptions);
$("#arrow").on("click", toggleArrow);
$("#check").on("click", check);
toggleArrow();

let corrects = 0, misses = 0, fails = 0;
do {
    initCode();
    const outputOfCheck = checkCode(currentSymbols);
    corrects = outputOfCheck.corrects;
    misses = outputOfCheck.misses;
    fails = outputOfCheck.fails;
} while (corrects > 0 || misses != 2);
createCardDivs();
check();