const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 3000;

app.use(cors());


// all function to generate prime numbers

// Basic Strategy
function isPrimeBasic(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    let i = 5;
    while (i * i <= num) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
        i += 6;
    }
    return true;
}

function generatePrimesBasic(start, end) {
    const primes = [];
    for (let i = start; i <= end; i++) {
        if (isPrimeBasic(i)) {
            primes.push(i);
        }
    }
    return primes;
}

// Sieve of Eratosthenes
function sieveOfEratosthenes(start, end) {
    const primes = [];
    const sieve = new Array(end + 1).fill(true);
    for (let p = 2; p * p <= end; p++) {
        if (sieve[p] === true) {
            for (let i = p * p; i <= end; i += p) {
                sieve[i] = false;
            }
        }
    }
    for (let p = Math.max(2, start); p <= end; p++) {
        if (sieve[p]) {
            primes.push(p);
        }
    }
    return primes;
}

// Miller-Rabin Primality Test
function millerRabin(n, k) {
    if (n === 2 || n === 3) return true;
    if (n <= 1 || n % 2 === 0) return false;

    const d = n - 1;
    let r = 0;
    let dCopy = d; // Make a copy of d since it will be modified

    while (dCopy % 2 === 0) {
        dCopy /= 2;
        r++;
    }

    const witnessLoop = (a) => {
        let x = BigInt(a) ** BigInt(dCopy) % BigInt(n);
        if (x === 1 || x === n - 1) return true;
        for (let i = 0; i < r - 1; i++) {
            x = x ** BigInt(2) % BigInt(n);
            if (x === n - 1) return true;
        }
        return false;
    };

    for (let i = 0; i < k; i++) {
        const a = 2 + Math.floor(Math.random() * (n - 3));
        if (!witnessLoop(a)) return false;
    }

    return true;
}

function generatePrimesMillerRabin(start, end) {
    const primes = [];
    for (let i = Math.max(2, start); i <= end; i++) {
        if (millerRabin(i, 5)) {
            primes.push(i);
        }
    }
    return primes;
}

// getting request
app.get("/generate",(req,res)=>{
    let start = req.query.start;
    let end = req.query.end;
    let strategy = req.query.strategy;

    let primes;
    switch (strategy) {
        case "basic":
            primes = generatePrimesBasic(start, end);
            break;
        case "sieve":
            primes = sieveOfEratosthenes(start, end);
            break;
        case "miller-rabin":
            primes = generatePrimesMillerRabin(start, end);
            break;
        default:
            primes = [];
            break;
    }
    let primeText = primes.toString();
    res.send(primeText);

});



// start server
app.listen(PORT,()=>{
    console.log(`server is running on PORT ${PORT}`)
});