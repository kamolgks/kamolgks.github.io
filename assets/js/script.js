function showModules() {
    const loadingContainer = document.querySelector('.loading');
    const moduleContainer = document.querySelector('.module');

    loadingContainer.style.display = 'none';
    moduleContainer.style.display = 'block';
}

setTimeout(showModules, 1500);


const moduleButtons = document.querySelectorAll('.module-button');
moduleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const moduleInfo = button.nextElementSibling;
        moduleInfo.classList.toggle('hidden');
    });
});


document.addEventListener('click', function (event) {
    if (event.target.classList.contains('copy-button')) {
        var text = event.target.getAttribute('data-copy-text');
        copyText(text);
    }
});


function copyText(text) {
    var input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);

    input.select();
    document.execCommand('copy');

    document.body.removeChild(input);

    var notification = document.querySelector('.copy-notification');
    notification.classList.add('show');

    setTimeout(function () {
        notification.classList.remove('show');
    }, 2000);
}