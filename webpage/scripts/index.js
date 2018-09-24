window.onload = function(){
    document.getElementById('close').onclick = function(){
        mp = this.parentNode.parentNode.parentNode;

        this.parentNode.parentNode.hide();

        return false;
    };
};