
(function(win){
    var actions = function(){
        var eles = $(".wj-cell");
        var top = '0px';
        var table = document.createElement('div');
        var html = [];
        html.push("<tr>");

        [].forEach.call(eles, (ele, index, array)=>{
            //console.log(ele.style.top);
            //console.log(top);
            if(ele.style.top == top){
                html.push("<td>");
                html.push(ele.innerText);
                html.push("</td>");
            }else{
                html.push("</tr>");
                top = ele.style.top;
                if(index < array.length - 1){
                    html.push("<tr>");
                }
                
            }
        });

        table.innerHTML = "<table>" + html.join('') + "</table>";
        win.table = table.innerHTML;
        return table.innerHTML
    }

    //win.tableConvert = actions;
    win.getData = function(){
        return tableConvert();
    }
    
})(window)
