function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

const readline = require('readline');

function askQuestion(query, callback) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}



//

const answer = shuffle(['1', 'B', '3', '4', '5', '6', '7']).splice(0, 4);
const corres = shuffle(['A', 'B', 'C', 'D', 'E', 'F', 'G']);

(async () => {
    let curr = '';
    while (curr !== answer.join('')) {
        curr = await askQuestion("Make your guess: ");
        const out = curr.split('').map((letter, i) => {
            const nr = 1 + corres.indexOf(letter);
            const pos = answer.indexOf('' + nr);
            if (pos === i) return nr + ' = ✓';
            if (answer.includes('' + nr)) return nr + ' = ?'
            return nr + ' = X'
        });
        console.log(shuffle(out).join('\n'));
    }
})()