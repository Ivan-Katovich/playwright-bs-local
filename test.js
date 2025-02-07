let a = {
    b:1,
    c:2,
    d: {
       e:4,
       f:6
    }
}

const x = a.d;

a.d.e = 8

console.log(a);
console.log(x);

const arr = ['Hello', 'my', 'lovely', 'world'];

const row = arr.reduce((phrase, word) => {
    return phrase + ' ' + word;
}, '')

console.log(row);


