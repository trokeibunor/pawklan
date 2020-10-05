var check = function() {
if (document.getElementById('staffPassword').value ==
    document.getElementById('staffConfirmPassword').value) {
    document.getElementById('message').style.color = 'green';
    document.getElementById('message').innerHTML = 'matching';
} else {
    document.getElementById('message').style.color = 'red';
    document.getElementById('message').innerHTML = 'not matching';
}
}
console.log('hello world')