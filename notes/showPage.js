/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function showPage(evt)
{
   var mask = document.getElementById("maskOfPic");

   //然后关联背景层消失事件
   mask.onclick = maskHidePage;

   var selected;
    //获取触发事件ID
    if(document.all)
        selected = window.event.srcElement.id;
    else
        selected = evt.target.id;

    //alert(selected);
    //将参数拆分重组 selected="06100007+00000053+00000053(102,613,164,662).jpg"
   var variables = selected.split("+");
   var characterFile = variables[2].split(".jpg")[0]; //="00000053(102,613,164,662)"

   //接下来的部分就是使用AJAX确保要访问的文件存在，并且返回原来文件的大小
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        // code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            var info = xmlhttp.responseText;
            var pageSize = info.split("#")[0];
            var version = info.split("#")[1];

           //确定文件存在后再调用flash
           var variablesNum = "bookID=" + variables[0] + "&pageID=" + variables[1] + "&characterFile=" + characterFile + "&pageSize=" + pageSize + "&version=" + version;

           //然后要为指定图片框中指定图像源 : THIS FLASH THING ALWAYS LAUNCHES
           mask.innerHTML= playSWF(variablesNum, pageSize);
        }
    }
    xmlhttp.open("GET", encodeURI("GetPageSize?bookID=" + variables[0] + "&pageID=" + variables[1] + "&characterFile=" + characterFile), true);
    xmlhttp.send();
}

function maskHidePage()
{
    var mask = document.getElementById("maskOfPic");

    mask.style.display = "none";
}

function playSWF(sFile, pageSize) //THIS PART DRAWS THE BOX AROUND THE CHARACTER
{
    var size = pageSize.split("-");

    var sWidth = 820;            //By hardcoding the page width we loose resolution
    var sHeight = (sWidth * size[1]) / size[0] + 40;

    //然后指定透明层的大小
    var mask = document.getElementById("maskOfPic");
    mask.style.display = "block";

    mask.style.width = document.body.scrollWidth + "px";
    mask.style.height = (document.body.scrollHeight > sHeight) ? (document.body.scrollHeight + 50) : (sHeight + 50)  + "px";


    var finalSWF = "";

    finalSWF += "<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\"" + sWidth + "\" height=\"" + sHeight + "\" id=\"DrawShape\">";
        finalSWF += "<param name=\"movie\" value=\"flash/ShowThePage.swf\" />";
        finalSWF += "<param name=\"quality\" value=\"high\" />";
        finalSWF += "<param name=\"bgcolor\" value=\"#ffffff\" />";
        finalSWF += "<param name=\"allowScriptAccess\" value=\"sameDomain\" />";
        finalSWF += "<param name=\"allowFullScreen\" value=\"true\" />";
        finalSWF += "<param name=\"FlashVars\" value=\"" + sFile + "\" />";

        finalSWF += "<object id=\"DrawShape\" width=\"" + sWidth + "\" height=\"" + sHeight + "\" align=\"middle\" type=\"application/x-shockwave-flash\" name=\"DrawShape\" data=\"flash/ShowThePage.swf\">";
            finalSWF += "<param name=\"quality\" value=\"high\">";
            finalSWF += "<param name=\"bgcolor\" value=\"#ffffff\">";
            finalSWF += "<param name=\"allowscriptaccess\" value=\"sameDomain\">";
            finalSWF += "<param name=\"allowfullscreen\" value=\"true\">";
            finalSWF += "<param name=\"FlashVars\" value=\"" + sFile + "\" />";
        finalSWF += "</object>";
    finalSWF += "</object>";

    return finalSWF;
}
