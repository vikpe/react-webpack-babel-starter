
(function(win){
    var action = function(){
        var eles = $(".wj-cell");
        var top = '0px';
        var table = document.createElement('div');
        var html = [];
        html.push("<tr>");

        var len = eles.length;
        for(var i =0; i< len; i++){
            var ele = eles[i];
            if(ele.style.top == top){
                html.push("<td>");
                html.push(ele.innerText);
                html.push("</td>");
            }else{
                html.push("</tr>");
                top = ele.style.top;
                if(i < len - 1){
                    html.push("<tr>");
                }
                
            }
        }

        table.innerHTML = "<table>" + html.join('') + "</table>";
        win.table = table.innerHTML;
        return table.innerHTML
    }

    //win.tableConvert = actions;
    win.getData = function(){
        return action();
    }
    
})(window)
