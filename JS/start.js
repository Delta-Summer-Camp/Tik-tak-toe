window.onload = function() {
    let el = document.getElementById('hi');
    el.onclick = function(ev) {
        this.remove();
    };
}
