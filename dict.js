// ==UserScript==
// @name          Dictionary
// @namespace     http://diveintogreasemonkey.org/download/
// @description   Dictionary script
// @include       *
// @grant         none
//UserScript
var elements = [
    document.querySelectorAll('span'),
    document.querySelectorAll('p')
];
for (var i = 0; i < elements.length; i++) {
    for (var j = 0; j < elements[i].length; j++) {
        //console.log(j);
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://127.0.0.1:3000/dict',
            data: 'i=' + i + '&' + 'j=' + j + '&' + 'data=' + elements[i][j].textContent,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            onload: function (response) {
                if (response.status != 200) {
                    return ;
                }
                if (response.responseText == '') {
                    return ;
                }
                //console.info(response.responseText);

                var json = eval('(' + response.responseText + ')');
                var t = elements[json.i][json.j].textContent;
                elements[json.i][json.j].textContent = '';
                for (var x = 0; x < json.dict.length; x++) {
                    //console.info(json.dict[x]);
                    //elements[json.i][json.j].innerHTML = elements[json.i][json.j].innerHTML.replace(json.dict[x][0], '<ruby><rb>' + json.dict[x][0] + '</rb><rt  style="color: red">' + json.dict[x][1] + '</rt></ruby>');
                    var re = new RegExp('(' + json.dict[x][0] + '[a-z]*' + ')');
                    t = t.replace(re, '<ruby><rb>' + '$1' + '</rb><rt  style="color: red">' + json.dict[x][1] + '</rt></ruby>');
                    t = t.replace(json.dict[x][0], '<span style="color:navy">' + json.dict[x][0] + '</span>');
                }
                var s = document.createElement('span');
                s.innerHTML = t;
                elements[json.i][json.j].appendChild(s);
                //console.info(json);
            }
        });
    }
}
