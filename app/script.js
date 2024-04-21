var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
function shuffle(array) {
    var _a;
    var currentIndex = array.length;
    var randomIndex;
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        _a = [array[randomIndex], array[currentIndex]], array[currentIndex] = _a[0], array[randomIndex] = _a[1];
    }
    return array;
}
var symbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
var answer, currentSymbols, restOfSymbols;
function initCode() {
    restOfSymbols = shuffle(__spreadArray([], symbols, true));
    currentSymbols = __spreadArray([], restOfSymbols.splice(0, 4), true);
    answer = shuffle(__spreadArray([], symbols, true)).splice(0, 4);
}
var droppableOptions = {
    drop: function (ev, ui) {
        $(this).find(".card").detach().appendTo($(ui.draggable).parent());
        $(ui.draggable).detach().css({ top: 0, left: 0 }).appendTo(this);
    }
};
var draggableOptions = { revert: "invalid" };
function createCardDivs() {
    for (var i = 0; i < currentSymbols.length; i++) {
        var letterIndex = i;
        var card = $("<div class=\"card\"><img src=\"assets/symbol_".concat(currentSymbols[i], ".svg\"></div>"));
        card.attr("codeValue", currentSymbols[i]);
        $("#current_" + i).append(card);
        card.draggable(draggableOptions);
    }
    for (var i = 0; i < restOfSymbols.length; i++) {
        var card = $("<div class=\"card\"><img src=\"assets/symbol_".concat(restOfSymbols[i], ".svg\"></div>"));
        card.attr("codeValue", restOfSymbols[i]);
        $("#rest_" + i).append(card);
        card.draggable(draggableOptions);
    }
}
var isVisible = true;
function toggleArrow() {
    isVisible = !isVisible;
    if (isVisible) {
        $("#arrow").removeClass("small");
        $("#rest").show("blind");
    }
    else {
        $("#arrow").addClass("small");
        $("#rest").hide("blind");
    }
}
function get(i) {
    var div = $("#current_" + i).find(".card");
    return div.attr("codeValue");
}
function checkCode(code) {
    var corrects = 0;
    var misses = 0;
    var fails = 0;
    code.forEach(function (letter) {
        if (answer.includes(letter)) {
            var posOfLetterInCode = code.indexOf(letter);
            var posOfLetterInAnswer = answer.indexOf(letter);
            if (posOfLetterInCode == posOfLetterInAnswer) {
                corrects++;
            }
            else {
                misses++;
            }
        }
        else {
            fails++;
        }
    });
    return { corrects: corrects, misses: misses, fails: fails };
}
function check() {
    var currCode = [get(0), get(1), get(2), get(3)];
    var _a = checkCode(currCode), corrects = _a.corrects, misses = _a.misses, fails = _a.fails;
    var left = $("<span class=\"left\"></span>");
    var mid = $("<span class=\"middle\">\u2192</span>");
    var right = $("<span class=\"right\"></span>");
    var nr = $("<div class=\"number\">".concat($('#attempts').children().length + 1, "</div>"));
    var div = $("<div class=\"attempt\"></div>");
    currCode.forEach(function (letter) {
        left.append($("<img src=\"assets/symbol_".concat(letter, ".svg\">")));
    });
    for (var i = 0; i < corrects; i++)
        right.append($("<img src=\"assets/circle_green.svg\">"));
    for (var i = 0; i < misses; i++)
        right.append($("<img src=\"assets/circle_yellow.svg\">"));
    for (var i = 0; i < fails; i++)
        right.append($("<img src=\"assets/circle_red.svg\">"));
    div.append([left, mid, right, nr]);
    $("#attempts").prepend(div);
    // console.log({ corrects, misses, fails });
}
$('.drop').droppable(droppableOptions);
$("#arrow").on("click", toggleArrow);
$("#check").on("click", check);
toggleArrow();
var corrects = 0, misses = 0, fails = 0;
do {
    initCode();
    var outputOfCheck = checkCode(currentSymbols);
    corrects = outputOfCheck.corrects;
    misses = outputOfCheck.misses;
    fails = outputOfCheck.fails;
} while (corrects > 0 || misses != 2);
createCardDivs();
check();
