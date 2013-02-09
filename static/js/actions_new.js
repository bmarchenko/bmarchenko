
function armor(id){
    var x=window.screen.availWidth/2-350;
    var y=window.screen.availHeight/2-150;
    window.open("../rezerv/blank.php?p05id="+id, "_blank", "width=700,toolbar=0,location=0,directories=0,resizable=1,menubar=0,scrollbars=0,status=0,left="+x+",top="+y);
};
function trim(string){
    return string.replace(/(^\s+)|(\s+$)/g, "");
};
function timeout(tag, timevar, func){
    $('#'+tag).fadeIn(500);
    i = --timevar;
    $('#'+tag+' span').text(i);
    setTimeout((i>0)?'timeout(\''+tag+'\', '+i+', \''+func+'\')':func, 1000);
};
function g60(zapros){
    $.ajax({
        type: "POST",
        url: "/get-trains",
        data: zapros,
        csrfmiddlewaretoken: '{{ csrf_token }}',
        dataType: "json",
        beforeSend: function(){
            before();
            $("#otv60").empty();
            $("#wait #descwait").text("Запрос наличия мест...");
            $("#wait").fadeIn(500);
        },
        complete: function(){
            $("#wait #descwait").empty();
            $("#wait").hide();
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){
            addMessages({'error':['Получен неверный формат данных. Повторите запрос.']});
        },
        success: function(data){
            $("#wait").hide();
            var lid = (data.lid)?data.lid:2;
            if (!data.timeout){
                if (data.trains){
                    $('#otv60').fadeIn(1500);
                    $('#otv60').append('<div id="accordion60">');
                    $.each(data.trains, function(i, val){
                        addTrain(val, lid, data.nstotpr, data.nstprib, data.granted);
                    })
                    $('#otv60').append('</div>');
                    $('#accordion60').accordion({
                        autoHeight: false
                    });
                }
            } else {
                timeout('timeout', data.timeout, 'g60()');
            }
            addMessages(data);
        }
    })
}
function p05(obj){
    if (!is_granted()){
        alert('Для того, чтобы продолжить, введите Ваш логин и пароль.');
        return;
    }
    if (!is_gooddate()){
        alert('Резервировать места можно только за 3-45 суток до отправления поезда.');
        return;
    }
    $.ajax({
        type: "GET",
        url: "rezerv/aj_p05.php",
        dataType: "json",
        beforeSend: function(){
            obj.empty().append('<img src="rezerv/img/ajax-loader.gif"><span id=descwait>Временная фиксация мест...</span>');
            init_1st_form();
        },
        error: function(){
            obj.empty().append('Ошибка выполнения запроса. Попробуйте еще раз.');
        },
        success: function(data){
            if (data.zakaz_id){
                zakaz_load(data.zakaz_id);
            } else {
                obj.empty().append('Ошибка выполнения запроса. Попробуйте еще раз.');
            }
            addMessages(data);
        }
    })
}
function is_granted(){
    var granted = false;
    $.ajax({
        type: "GET",
        url: "rezerv/aj_is_granted.php",
        dataType: "json",
        async: false,
        error: function(){
            granted = false;
        },
        success: function(data){
            granted = data.granted;
        }
    })
    return granted;
}
function is_gooddate(){
    var granted = false;
    $.ajax({
        type: "GET",
        url: "rezerv/aj_is_gooddate.php",
        dataType: "json",
        async: false,
        error: function(){
            granted = false;
        },
        success: function(data){
            granted = data.granted;
        }
    })
    return granted;
}
function g31_from_id(obj, zakaz_id){
    var oldcontent = obj.html();
    var zapros = "zakaz_id="+((zakaz_id==undefined)?(0):(zakaz_id));
    $.ajax({
        type: "POST",
        url: "rezerv/aj_g31.php",
        data: zapros,
        dataType: "json",
        beforeSend: function(){
            obj.empty().append('<img src="rezerv/img/ajax-loader.gif"><span id=descwait>Запрос стоимости...</span>');
        },
        complete: function(){
        },
        error: function(){
            obj.empty().html(oldcontent);
        },
        success: function(data){
            if (data.adult){
                zakaz_load(zakaz_id);
            } else {
                obj.empty().html(oldcontent);
                $('#costbutton').click(function(){
                    g31_from_id($('#itogozakaz .cost'), zakaz_id);
                    $('#pay_rezerv').attr('disabled', 'true');
                    $('#pay_dostavka').attr('disabled', 'true');
                })
            }
            addMessages(data);
        }
    })
}
function zakaz_load(zakaz_id){
    var zapros=(zakaz_id!=undefined)?('zakaz_id='+zakaz_id):('vagon='+$("#numVagon").text()+'&mesta='+$("#g81mesta").text());
    if (!is_granted()){
        alert('Для того, чтобы продолжить, введите Ваш логин и пароль.');
        return;
    }
    $.ajax({
        type: "POST",
        url: "rezerv/aj_p05_prepare.php",
        data: zapros,
        dataType: "json",
        error: function(){
            $('#bronzakaz .body').append('<div>Неверное завершение процесса подготовки заказа. Повторите, пожалуйста, еще раз.</div>').css({
                'margin':'25px',
                'font-size':'1.5em'
            });
        },
        success: function(data){
            var z = data.zakaz;
            var f = data.flags;
            var bh = $('#bronzakaz .head').empty();
            var bb = $('#bronzakaz .body').empty();
            var bf = $('#bronzakaz .foot').empty();
            var bo = $('#bronzakaz .oplata').empty();
            if (!data.error){
                if (z&&f) {
                    bh.append('<span class="blue">ЗАКАЗ №: </span>');
                    var yyy = (!z.strih_kod)?('номер не присвоен'):(z.strih_kod);
                    bh.append('<span class="green">'+yyy+'</span>');
                    bb.append('<table id="itogozakaz"></table>');
                    $('#itogozakaz').append('<tr><td class="title">Дата отправления:</td> <td class="znach">'+z.sdate+'</td></tr>');
                    $('#itogozakaz').append('<tr><td class="title">Поезд №:</td> <td class="znach">('+z.nomtrain+') <span class="orange">'+z.nametrain+'</span></td></tr>');
                    $('#itogozakaz').append('<tr><td class="title">Вагон:</td> <td class="znach">'+z.vagon+z.typevag+'</td></tr>');
                    $('#itogozakaz').append('<tr><td class="title">Места:</td> <td class="znach">'+z.mesta+'</td></tr>');
                    $('#itogozakaz').append('<tr><td class="title">Отправление: </td> <td class="znach">('+z.timeotpr+') <span class="orange">'+z.nstotpr+'</span></td></tr>');
                    $('#itogozakaz').append('<tr><td class="title">Прибытие: </td> <td class="znach">('+z.timeprib+') <span class="orange">'+z.nstprib+'</span></td></tr>');
                    if (f.is_in_db==0){
                        p05(bf);
//bf.append('<input id="not_in_db_button" type="button" value="Зафиксировать заказ и продолжить оформление.">');
//$('#not_in_db_button').click(function(){p05(bf);})
                    } else {
                        if (f.is_success==0){
                            bf.append('Попытка зарезервировать данный заказ завершилась неудачей...');
//setTimeout($("#bronzakaz").dialog('close'),3000);
                        } else if (f.is_payed==0) {
                            bf.append('<input id="pay_rezerv" type="button" value="Резервировать места">&nbsp;&nbsp;&nbsp;');
                            if (false && (z.nomtrain=='155О'||z.nomtrain=='156К'||z.nomtrain=='161О'||z.nomtrain=='164О'))
                                bf.append('<input id="pay_dostavka" type="button" value="Доставка билетов в поезд">');
                            $('#itogozakaz').append('<tr><td class="title">Стоимость места в вагоне: </td> <td class="znach"><span class="cost"><input id="costbutton" type="button" value="Запросить стоимость"></span></td></tr>');
                            $('#pay_rezerv').click(function(){
                                $('#pay_rezerv').attr('disabled', 'true');
                                $('#pay_dostavka').removeAttr('disabled');
                                bo.hide().empty();
                                bo.append('<div class="title">Резервирование мест:</div>');
                                bo.append('<div>Стоимость резервирования 1-го места: <span class="orange">'+z.cost.rezervirovaniye+'</span> грн.</div>');
                                bo.append('<div>Количество мест: <span class="orange">'+z.smestcnt+'</span></div>');
                                bo.append('<div>Итого к оплате: <span class="orange">'+z.smestcnt+'</span> x <span class="orange">'+z.cost.rezervirovaniye+'</span> = <span class="orange">'+(z.smestcnt*z.cost.rezervirovaniye)+'</span> грн.</div>');
                                bo.append('<div class="visa"><div class="mastercard"><div class="foot"><input id="oplata_rezerv" type="button" value="Оплатить"></div></div></div>');
                                bo.slideDown(500);
                                $('#oplata_rezerv').click(function(){
                                    send_oplata(1, zakaz_id);
                                });
                            })
                            $('#pay_dostavka').click(function(){
                                $('#pay_dostavka').attr('disabled', 'true');
                                $('#pay_rezerv').removeAttr('disabled');
                                bo.hide().empty();
                                bo.append('<div class="title">Доставка билетов в поезд:</div>');
                                bo.append('<div class="norm">Заполните, пожалуйста, ниже реквизиты каждого пассажира.</div>');
                                bo.append('<table id="tab_passazh" cellpadding=5></table>');
                                bo.append('<div id="price_div"></div>');
                                $('#tab_passazh').append('<tr class="head"><td class="bold">Место</td><td class="bold">Фамилия И.О.</td><td class="bold">№документа</td><td class="bold">Дата рождения</td><td class="bold">Детск.</td><td class="bold">Цена, грн.</td></tr>');
                                $.each(z.armesta, function(i, val){
                                    $('#tab_passazh').append('<tr><td class="blue round bold">'+val+'</td><td class="round"><input class="txt" id="fio'+val+'" type="text"></td><td class="round"><input class="txt " id="doc'+val+'" type="text"></td><td class="round"><input disabled="true" class="txt dr" id="dr'+val+'" type="text"></td><td class="ch round"><input id="d'+val+'" type="checkbox"></td><td class="green round cost bold"><span id="cost'+val+'"></span></td></tr>');
                                    $('#dr'+val).datepicker({
                                        dateFormat: 'dd-mm-yy',
                                        dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                                        dayNamesMin:['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                                        firstDay: 1,
                                        maxDate: '-1d',
                                        minDate: '-14y',
                                        monthNames: [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                                            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь '],
                                        buttonImage: 'rezerv/img/calendar.jpg',
                                        buttonImageOnly: true,
                                        buttonText: 'Выбрать',
                                        duration: 'fast',
                                        showOptions: {direction: 'up'},
//showOn: 'button',
                                        defaultDate: '-10y',
                                        hideIfNoPrevNext: true,
                                        gotoCurrent: true
                                    });
                                    $('#d'+val).click(function(){
                                        if ($(this).attr('checked')){
                                            $('#dr'+val).removeAttr('disabled');
                                        } else {
                                            $('#dr'+val).attr('disabled', 'true');
                                        }
                                        update_price($('#price_div'), z);
                                    });
                                });
                                $('#tab_passazh').append('<tr class="foot"><td colspan=5 class="bold ">Итого:</td><td class="orange total bold"></td></tr>');
                                $('#tab_passazh td').addClass('round');
                                update_price($('#price_div'), z);
                                bo.append('<div class="visa"><div class="mastercard"><div class="foot"><input id="oplata_dostavka" type="button" value="Оплатить"></div></div></div>');
                                $("#oplata_dostavka").attr('disabled', 'true');
                                var dostavka_parameters='';
                                $("input:text, input:checkbox").change(function(){
                                    dostavka_parameters='';
                                    var pr = false;
                                    $.each(z.armesta, function(i, val){
                                        if (trim(document.getElementById('fio'+val).value)==''||
                                            trim(document.getElementById('doc'+val).value)==''){
                                            pr = true;
                                        }
                                        if (!document.getElementById('dr'+val).disabled && document.getElementById('dr'+val).value ==''){
                                            pr = true;
                                        }
                                        dostavka_parameters += '&fio'+val+'='+document.getElementById('fio'+val).value;
                                        dostavka_parameters += '&doc'+val+'='+document.getElementById('doc'+val).value;
                                        if (document.getElementById('d'+val).checked)dostavka_parameters += '&dr'+val+'='+document.getElementById('dr'+val).value;
                                    });
                                    if (pr){
                                        $("#oplata_dostavka").attr('disabled', 'true');
                                    } else {
                                        $("#oplata_dostavka").removeAttr('disabled');
                                    }
                                })
                                bo.slideDown(500);
                                $('#oplata_dostavka').click(function(){
                                    send_oplata(2, zakaz_id, dostavka_parameters);
                                });
                            });
                            if (f.is_cost_exist==0){
                                g31_from_id($('#itogozakaz .cost'), zakaz_id);
                                $('#pay_rezerv').attr('disabled', 'true');
                                $('#pay_dostavka').attr('disabled', 'true');
                            } else {
                                $('#pay_dostavka').removeAttr('disabled');
                                $('#pay_rezerv').removeAttr('disabled');
                                $('#itogozakaz .cost').css('font-size', '12px').empty().
                                    append('Взрослый: <span class="orange bold">'+z.cost.adult_total+'</span> грн.&nbsp;&nbsp;').
                                    append('Детский: <span class="orange bold">'+z.cost.child_total+'</span> грн.');
                                $('#pay_rezerv').click();
                            }
//g31_from_id();
                        } else { // Если оплачено
                            if (f.is_rezerv != 0){
                                bo.append('<div>Резервирование</div>');
                            } else if (f.is_dostavka != 0) {
                                bo.append('<div>ДОСТАВКА БИЛЕТОВ К ПОЕЗДУ.</div>');
                                bo.append('<div class="l norm">Вы оплатили полную стоимость билетов по маршруту, указанному в заказе.</div>');
                                bo.append('<div class="l norm">Мы обязуемся оформить и доставить оплаченные Вами билеты к поезду в указанную в заказе дату.</div>');
                                bo.append('<div class="l norm">При посадке в вагон обязательно необходимо иметь документ, удостоверяющий личность, который Вы указали в заказе.</div>');
                                bo.append('<div class="l norm">Пожалуйста, перепишите или распечатайте информацию о Вашем заказе.</div>');
                            } else {
                                bo.append('<div>Нет признака услуги</div>');
                            }
                            bo.slideDown(500);
                        }
                    }
                }
            } else {
                $.each(data.error, function(i, val){
                    bb.append('<div>'+val+'</div>');
//$('#error'+i).css('padding-bottom','5px');
                })
            }
            addMessages(data);
        }
    })
}
function send_oplata(typeusl, zakazid, params){
    f_typeusl = (typeusl=='undefined')?(''):(typeusl);
    f_zakazid = (zakazid=='undefined')?(''):(zakazid);
    f_params = (params=='undefined')?(''):('&'+params);
    $.ajax({
        type: "POST",
        url: "rezerv/aj_oplata.php",
        data: "typeusl="+f_typeusl+"&zakazid="+f_zakazid+f_params,
        dataType: "json",
        beforeSend: function(){
//before();
//$("#otv60").empty();
//$("#wait").fadeIn(500);
        },
        complete: function(){
//$("#wait").hide();
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){
            addMessages({'error':['Получен неверный формат данных. Повторите запрос.']});
        },
        success: function(data){
            if (!data.error){
                if (data.sentry_send_id != undefined){
                    location.href='http://www.pz.gov.ua/rezerv/checkout_new.php?sentry_send='+data.sentry_send_id;
                } else {
                    addMessages({'error':['Получен неверный формат данных. Повторите запрос.']});
                }
            }
            addMessages(data);
        }
    })
}
function update_price(bo, z){
    bo.empty();
    var cost;
    var tot_tarif = 0;
    $.each(z.armesta, function(i, val){
        cost = ($('#d'+val).attr('checked'))?parseFloat(z.cost.child_total):parseFloat(z.cost.adult_total);
        tot_tarif += parseFloat(cost);
        tot_tarif = Math.round(tot_tarif*100)/100;
        $('#cost'+val).text(cost);
    });
    $('#tab_passazh .total').text(tot_tarif);
    bo.append('<div>Стоимость билетов в заказе: <span class="orange">'+tot_tarif+'</span> грн.</div>');
    var rezerv = (z.cost.rezervirovaniye*z.smestcnt);
    bo.append('<div>Стоимость резервирования: <span class="orange">'+z.cost.rezervirovaniye+'</span> x <span class="orange">'+
        z.smestcnt+'</span> = <span class="orange">'+rezerv+'</span> грн.</div>');
    var oform = Math.round((10 + (tot_tarif/100*z.cost.procent))*100)/100;
    bo.append('<div>Оформление услуги доставки: <span class="orange">'+oform+'</span> грн.</div>');
    var total = Math.round((tot_tarif+rezerv+oform)*100)/100;
    bo.append('<div>Итого к оплате: <span class="orange">'+tot_tarif+'</span> + <span class="orange">'+(Math.round((rezerv+oform)*100)/100)+
        '</span> = <span class="orange">'+total+'</span> грн.</div>');
}
function g81(nomtrain, typevag, nametrain, ltype, otpr, prib){
    /*if (!is_granted()){
     alert('Для того, чтобы продолжить, введите Ваш логин и пароль.');
     return;
     }*/
    $("#gXXparams > #gXXzag > div").text('ВЫБОР СВОБОДНЫХ МЕСТ В ВАГОНЕ:');
    if (otpr!=undefined)$('#timeOtpr').text('('+otpr+') ');
    if (prib!=undefined)$('#timePrib').text('('+prib+') ');
    if (nomtrain!=undefined&&nametrain!=undefined){
        $("#gXXparams > #params").append('<tr><td class="r">Поезд № <span class="green">'+nomtrain+'</span>:</td><td class="l"><span class="orange" id="g81nametrain">'+nametrain+'</span></td><tr>');
        $("#gXXparams > #params").append('<tr><td class="r">Вагон:</td><td class="l"><span class="green" id="numVagon"></span><span class="orange" id="g81typevag">('+ltype+')</span></td><tr>');
        $("#gXXparams > #params").append('<tr><td class="r">Места:</td><td class="l"><span class="green" id="g81mesta">не выбраны</span></td><tr>');
        $("#gXXparams > #verniteVvod").html('<input id="backToEnter2" type="button" value="Изменить данные" title="Изменить данные" ><input id="doZakaz" type="button" value="Оформить заказ" title="Оформить заказ" disabled="true">');
        $("#backToEnter2").click(function(){
            init_1st_form()
        });
        $("#doZakaz").click(function(){
            $("#bronzakaz").dialog("open");
            zakaz_load();
        });
    }
    var zapros = '' + ((nomtrain!=undefined)?('nomtrain="'+nomtrain+'"'):'');
    zapros += (typevag!=undefined)?(((nomtrain!=undefined)?'&':'')+'typevag="'+typevag+'"'):'';
    zapros += (nametrain!=undefined&&nomtrain!=undefined)?('&nametrain='+nametrain+''):'';
    zapros += (otpr!=undefined)?('&timeotpr='+otpr+''):'';
    zapros += (otpr!=undefined)?('&timeprib='+prib+''):'';
    $.ajax({
        type: "POST",
        url: "rezerv/aj_g81.php",
        data: zapros,
        dataType: "json",
        beforeSend: function(){
            before();
            $("#wait #descwait").text("Запрос пономерного наличия мест...");
            $("#wait").fadeIn(500);
        },
        complete: function(){
            $("#wait").hide();
        },
        error: function(){
            addMessages({'error':['Ошибочный ответ. Повторите, пожалуйста, запрос.']});
        },
        success: function(data){
//$("#wait").hide();
            var lid = (data.lid)?data.lid:2;
//if (data.granted){
            if (!data.timeout){
                if (data.vagons){
                    $('#otv81').fadeIn(1500);
                    $('#otv81').append('<div id="accordion81">');
                    $.each(data.vagons, function(i, val){
                        addVagon(val, lid);
                    })
                    $('#otv81').append('</div>');
                    initAccord81();
                }
            } else {
                timeout('timeout', data.timeout, 'g81()');
            }
//} else {
// $("#otv60").fadeIn(1500);
//}
            addMessages(data);
        }
    })
}
function g31(tagname, numvag){
    /*if (!is_granted()){
     alert('Для того, чтобы продолжить, введите Ваш логин и пароль.');
     return;
     }*/
    $.ajax({
        type: "POST",
        url: "rezerv/aj_g31.php",
        data: numvag?"vagon="+numvag:"",
        dataType: "json",
        beforeSend: function(){
// before();
            $("#"+tagname).empty().append('<img src="rezerv/img/ajax-loader.gif">');
            $("#"+tagname).fadeIn(500);
            $(".cost input").attr('disabled', 'true');
        },
        complete: function(){
            $(".cost input").removeAttr('disabled');
// $("#"+tagname).hide();
        },
        success: function(data){
            $("#"+tagname).empty();
            if (!data.timeout){
                if (data.adult){
                    $("#"+tagname).append('<span>Взрослый - <span class="green">'+data.adult.total+'</span> грн.</span>');
                }
                if (data.child){
                    $("#"+tagname).append('&nbsp;&nbsp;&nbsp;<span>Детский - <span class="green">'+data.child.total+'</span> грн.</span>');
                }
            } else {
                $("#"+tagname).html('Запрос будет выполнен через <span class="green">0</span> сек.');
                timeout(tagname, data.timeout, 'g31("'+tagname+'")');
            }
        }
    })
}
function initAccord81(){
    $('#accordion81').accordion({
        autoHeight: false,
        animated: false
    });
    $("#accordion81 input").click(function(){
        var bgdis = '#a6c9e2';
        var strmesta = '';
        var $parentDiv = $(this).parent().parent();
        var i=0; cnt = 4; blEnd = false;
        var old = $("input[type='checkbox']", $parentDiv).get(0);
        var thisattr = $(this).parent().parent().attr('id');
        $("div .mesta").not("#"+thisattr).each(function(){
            $(this).children().css('background', '#ffffff');
            $(this).children().children().removeAttr('disabled');
            $(this).children().children().removeAttr('checked');
        })
        $("input[type='checkbox']", $parentDiv).each(function(){
            if ($(this).attr('checked') && (i<cnt) && !blEnd){
                strmesta += ((i==0)?(''):(', '))+$(this).attr('value');
                i++;
                $(this).parent().css('background', '#ffffff');
                $(this).removeAttr('disabled');
            } else {
                if ($(old).attr('checked') && (i<cnt)){
                    $(this).parent().css('background', '#ffffff');
                    $(this).removeAttr('disabled');
                } else {
                    $(this).parent().css('background', bgdis);
                    $(this).attr('disabled', 'true');
                    $(this).removeAttr('checked');
                }
                if (!blEnd&&i>0)blEnd=true;
            }
            old = $(this);
        });
        $('#g81mesta').text((strmesta=='')?('не выбраны'):(strmesta));
        if (i == 0){
            $("input[type='checkbox']", $parentDiv).parent().css('background', '#ffffff');
            $("input[type='checkbox']", $parentDiv).removeAttr('disabled');
            $("#doZakaz").attr('disabled', 'true');
        } else {
            $("#doZakaz").removeAttr('disabled');
        }
    })
}
function updateVag(vag){
    $('#numVagon').text(vag+' ');
}
function addVagon(val, lid){
    content = '<h3 class="accord"><a href=#>'+ val.longtype+' №: <font color="#AA3333">'+
        val.number+'</font>&nbsp;&nbsp;&nbsp;'+((lid==1)?"Мест: ":"Місць: ")+'<font color="#3333AA">'+
        val.mcount+'</font></a></h3>';
    if (val.mesta){
        c=''; i=0; col=10;
        content += "<div class='mesta' id='vag"+val.number+"' >";
// mtab = '<ul>';
        mtab = '';
        $.each(val.mesta, function(j, valm){
            i++;
            mtab += "<span class=check><input onclick=\"updateVag('"+val.number+"')\" value='"+valm+"' type='checkbox'><span>"+valm+"</span> </span>";
//c += ((j>0)?', ':'') + valm;
            if (i==6){
//mtab += '<br>';
                i=0;
            }
        });
        mtab += '';
// mtab += '</ul>';
        content += mtab+'<div class="cost" id="v'+val.number+'" ><input type=button onclick="g31(\'v'+val.number+
            '\', \''+val.number+'\')" style="font-size:12px;" value="Узнать стоимость"></div>';
        content += '</div>';
    }
    $("#accordion81").append(content);
}
function addMInTrain(train, stype, ltype, count, nametrain, otpr, prib, granted){
    var str = 'onmouseover="this.style.backgroundColor=\'#88ff88\'" onmouseout="this.style.backgroundColor=\'#f7f7f7\'" onclick="g81(\''+train+'\', \''+stype+'\', \''+nametrain+'\', \''+ltype+'\', \''+otpr+'\', \''+prib+'\')"';
    return ((count!=0)?('<span class="mesta round" '+str+'>'+ltype+' - <span>'+count+'</span></span>'):'');
}
function addTrain(val, lid, nstotpr, nstprib, granted){
    var mesta = 0+val.l+val.k+val.p+val.o;
    content = '<h3 class="accord60"><a href=#><table width=100% style="font-size:12px;"><tr><td>';
    content += '<font color="#2e6e9e">'+ val.otpr+'&nbsp;&gt;</font>&nbsp;&nbsp;';
    content += '<font color="#069959"><b>'+val.train[0]+'</b></font> ';
    content += '<font color="#e17009"><b>'+val.from[0]+'</b></font> - ';
    content += '<font color="#e17009"><b>'+val.to[0]+'</b></font>';
    fromto = val.from[0]+'-'+val.to[0];
    smesta = ''+mesta; add = '';
    lastdg = smesta[smesta.length-1];
    if (lastdg=='1'){add='о';}
    if ((lastdg == '2' ||lastdg == '3' ||lastdg == '4') && !(mesta>10 && mesta < 20)){add='а';}
    content += '</td><td class="zmesta"><b>'+ mesta +'</b> мест'+add+'</td></tr></table></a></h3>';
    content += '<div class="accordion-body"> <div class="desc">';
    content += '<div><span class="blue">'+val.otpr+'</span> - <span class="green">'+nstotpr+'</span> отправление </div>';
    content += '<div><span class="blue">'+val.prib+'</span> - <span class="green">'+nstprib+'</span> прибытие </div>';
    content += '<div>Дата отправления: <span class="blue">'+val.date+'</span>&nbsp;&nbsp;&nbsp;В пути: <span class="blue">'+val.vputi+'</span></div></div>';
    content += '<div class="mesta">';
    content += addMInTrain(val.train[0], 'Л', 'ЛЮКС', val.l, fromto, val.otpr, val.prib, granted);
    content += addMInTrain(val.train[0], 'К', 'КУПЕ', val.k, fromto, val.otpr, val.prib, granted);
    content += addMInTrain(val.train[0], 'П', 'ПЛАЦК.', val.p, fromto, val.otpr, val.prib, granted);
    content += addMInTrain(val.train[0], 'О', 'ОБЩИЙ', val.o, fromto, val.otpr, val.prib, granted);
    content += '</div>';
    content += '</div>';
    $("#accordion60").append(content);
}
function before(){
    $("#otv60").hide();
    $("#otv11").hide().empty();
    $("#otv81").hide().empty();
    $("#timeout").hide();
    $("#messages").hide().empty();
}
function addMessages(data){
    $('#messages').empty();
    if (data.error||data.warning||data.notice){
        $('#messages').fadeIn(500);
    }
    if (data.error){
        $.each(data.error, function(i, val){
            $('#messages').append('<div class="message error" ><div class="mesr">'+val+'</div></div>');
//$('#error'+i).css('padding-bottom','5px');
        })
    }
    if (data.warning){
        $.each(data.warning, function(i, val){
            $('#messages').append('<div class="message warning" ><div class="mesr">'+val+'</div></div>');
        })
    }
    if (data.notice){
        $.each(data.notice, function(i, val){
            $('#messages').append('<div class="message notice" ><div class="mesr">'+val+'</div></div>');
        })
    }
}
function init_1st_form(){
    before();
    $("#gXXparams").hide();
    $("#enterForm").fadeIn(500);
}

$(document).ready(function(){


		var pr = false;
		var temppr = false;
		var value='';
		var lastKeyCode='';
		var arrUprKey = [];
		var imgOn = true;

		var temp ='';

		function initForm() {
			$.ajax({
				url:	"rezerv/aj_init.php",
				type:	"GET",
				dataType:	"json",
				success: function(data){
					//alert(data.nstotpr);
					$("#stan1").val((data.nstotpr)?data.nstotpr:'');
					$("#stan2").val((data.nstprib)?data.nstprib:'');
					$("#numstan1").val((data.kstotpr)?data.kstotpr:'');
					$("#numstan2").val((data.kstprib)?data.kstprib:'');
					(data.date)?$("#date").val(data.date):$('#date').datepicker('setDate', +3);
					refreshbut();
				}
			})
		}

		$("#changeimg").click(function(){
			temp = $('#stan1').val();
			$('#stan1').val($('#stan2').val());
			$('#stan2').val(temp);
			temp = $('#numstan1').val();
			$('#numstan1').val($('#numstan2').val());
			$('#numstan2').val(temp);
		})

		function isUprCode(value){
			arrUprKey = [13, 37, 38, 39, 40];
			for(i=0; i<arrUprKey.length; i++){
				if (arrUprKey[i] == value){
					return true;
				}
			}
			return false;
		}


    $("#date").datepicker({
        dateFormat: 'dd-mm-yy',
        dayNames: ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'],
        dayNamesMin:['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        firstDay: 1,
        maxDate: '+44',
        minDate: '',
        monthNames: [ 'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
            'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
        buttonImage: 'rezerv/img/calendar.jpg',
        buttonImageOnly: true,
        buttonText: 'Вибрати',
        duration: 'fast',
        showOptions: {direction: 'up'},
        showOn: 'button',
        defaultDate: +1,
        hideIfNoPrevNext: true,
        gotoCurrent: true
    });

    function initFields(){
			$('#stan1, #stan2, #date, #numstan1, #numstan2').val('');
			$('#stan1').focus();
			$('#date').datepicker('setDate', +3);
			refreshbut();
		}

		initFields();

		$('#date').keydown(function(event){
			if (event.keyCode!=9){
				return false;
			}
		})

		function setEvents(txt){

			$('#del'+txt).click(function(){
				$('#'+txt+', #num'+txt).val('');
				$('#'+txt).focus();
				refreshbut();
			})

			$('#'+txt).keyup( function(event){

				$('#debug').val(event.keyCode);
				value = $(this).val();

				if (value.length < 3  ){
					$('#num'+txt).val('');
					refreshbut();
				}

				temppr = ( (value.length < 3) || (isUprCode(lastKeyCode)) )?false:true;

				if ( temppr) {
					$.getJSON('/get-stations', {'stan':value}, onAjaxSuccess);
					//$('#sel'+txt).fadeIn(500);
					//$('#num'+txt).fadeIn(500);
				} else{
					$('#sel'+txt).hide().empty();
				}
			});

			$('#'+txt).keydown ( function(event){
				lastKeyCode = event.keyCode;
				if (event.keyCode==40){ $('#sel'+txt).focus(); }
			});


			function hideSelect(txt1){
				$('#'+txt1).val(($('#sel'+txt1+' option:selected').html())?$('#sel'+txt1+' option:selected').html():'');
				$('#sel'+txt1).hide().empty();
			}

			$('#sel'+txt+', #'+txt).keydown ( function(event){
				if (event.keyCode==13){
					hideSelect(txt);
					refreshbut();
				}
			});

			$('#sel'+txt).click( function(){
				hideSelect(txt);
			})

			function onAjaxSuccess(data)	{
				var cnt = $.makeArray(data).length;
				var stan = ''
				var nom = '';

				$('#sel'+txt).empty().attr('size', cnt);

				$.each(data, function(i, station){

					stan=station.f_name;
					nom=station.id;

					ddd = $('<option>').attr('value', nom).append(stan);
					if (i==0){$('#num'+txt).val(nom); ddd.attr('selected', 'true');}

					ddd.appendTo('#sel'+txt)
				})

				if (cnt>1){
					$('#sel'+txt).show();
				} else if (cnt==1){
					$('#sel'+txt).hide();
					$('#'+txt).val(stan);
					$('#num'+txt).val(nom);
				} else {
					$('#num'+txt).val('');
				}
				refreshbut();
			}

			$('#sel'+txt).change(
				function(){
					$('#num'+txt).val($(this).attr('value'));
				}
			)

		}

		$('#date').focus(function(){
			$('#calendar').fadeIn(500);
		})

		$('#date').change(function(){
			refreshbut();
		})

		function refreshbut(){
			//alert(11);
			pr = (
				$('#numstan1').val()!='' &&
				$('#numstan2').val()!=''
			)

			if (!pr){
				if (imgOn){
					$('#changeimg').animate({
						width: "0px",
						height: "64px"
					}, 500).fadeOut(100);
					$('#knopki').slideUp('slow');
					imgOn = !imgOn
				}
			} else {
				if (!imgOn){
					$('#changeimg').fadeIn(100).animate({
						width: "64px",
						height: "64px"
					}, 500)
					$('#knopki').slideDown('slow');
					imgOn = !imgOn
				}
			}

			pr = (pr && $('#date').val()!='');

			if (!pr) {
				$('#mesta, #rasp').attr('disabled', 'true');
			} else {
				$('#mesta, #rasp').removeAttr('disabled')
			}
		}

//		<table cellspacing="10">
//    		<tr><td class="r">Ñòàíöèÿ îòïðàâëåíèÿ:</td><td class="l"><span id="g60stotpr">sd</span></td><tr>
//			<tr><td class="r">Ñòàíöèÿ íàçíà÷åíèÿ:</td><td class="l"><span id="g60stprib">asd</span></td><tr>
//    		<tr><td class="r">Äàòà îòïðàâëåíèÿ:</td><td class="l"><span id="g60date">asd</span></td><tr>
//    	</table>



    $('#mesta').click(function(){
        $("#gXXparams > #params").empty();
        $("#gXXparams > #gXXzag > div").text('НАЯВНІСТЬ ВІЛЬНИХ МІСЦЬ:');
        $("#gXXparams > #params").append('<tr><td class="r">Відправлення:</td><td class="l"><span class="orange" id="timeOtpr"></span><span id="g60stotpr">'+$("#stan1").val()+'</span></td><tr>');
        $("#gXXparams > #params").append('<tr><td class="r">Прибуття:</td><td class="l"><span class="orange" id="timePrib"></span><span id="g60stprib">'+$("#stan2").val()+'</span></td><tr>');
        $("#gXXparams > #params").append('<tr><td class="r">Дата відправлення:</td><td class="l"><span id="g60date">'+$("#date").val()+'</span></td><tr>');
        $("#gXXparams > #verniteVvod").html('<input id="backToEnter" type="button" value="Змінити дані" title="Змінити дані" >');
//$("#g60stotpr").text($("#stan1").val());
//$("#g60stprib").text($("#stan2").val());
//$("#g60date").text($("#date").val());
        $("#enterForm").hide();
        $("#gXXparams").fadeIn(500);
        $('#backToEnter').click(function(){
            init_1st_form();
        })

        g60("kstotpr="+$('#numstan1').val()+"&kstprib="+$('#numstan2').val()+"&sdate="+$('#date').val());

		})

		$("#tabs").tabs();


		initForm();

		setEvents('stan1');
		setEvents('stan2');

//		$("#bronzakaz").dialog({
//			autoOpen: 		false,
//		/*	buttons:		{
//				"Ok":	function(){
//					//p05($("#numVagon").text(), $("#g81mesta").text());
//					$(this).dialog('close');
//				},
//				"Cancel":	function(){
//					$(this).dialog('close');
//				}
//			},*/
//			close:			function(){
//					$('#bronzakaz .head').empty();
//					$('#bronzakaz .body').empty();
//					$('#bronzakaz .foot').empty();
//					$('#bronzakaz .oplata').empty();
//			},
//			draggable:		true,
//			resizable: 		false,
//			modal:			true,
//			position:		['center', 0],
//			//height:			480,
//			width:			640,
//			title:			'Îôîðìëåíèå çàêàçà'
//		});


//		function login_func(login, password){
//			var zapros='';
//			if (login!=undefined){
//				zapros += (login=='demo')?'logout=1':'login='+login+'&password='+password;
//			}
//			$.ajax({
//				type:	"POST",
//				url:	"rezerv/aj_login.php",
//				data:	zapros,
//				dataType:	"json",
//				beforeSend:	function(){
//				},
//				success:	function(data){
//					if (!data.granted){
//						$("#login").html('Ëîãèí: <input id="flogin" class="round" type="text">&nbsp;&nbsp;&nbsp;Ïàðîëü: <input id="fpassword" class="round" type="password">&nbsp;&nbsp;&nbsp;<input id="loginButton" type="button" value="Âîéòè">');
//						$("#loginButton").click(function(){	login_func($("#flogin").val(), $("#fpassword").val()); })
//					} else {
//						if (data.klient){
//							$("#login").html(data.klient.famil+' '+data.klient.imya+' '+data.klient.otchestvo+' &nbsp;&nbsp;&nbsp;<input id=logout type="button" value="logout">');
//							$("#logout").click(function(){
//								login_func('demo');
//							})
//						}
//					}
//					$("#tabs").tabs("load", 1);
//				//$("#login").hide();
//				}
//			})
//		}

//		$("#login").ready( function(){login_func();} );
//
//		function load_zayavki(){
//			$.ajax({
//				type:	"POST",
//				url:	"rezerv/aj_zayavki.php",
//				dataType:	"json",
//				success:	function(data){
//					$.each(data, function(i, val){
//						alert(i);
//					})
//				}
//			});
//		}
	})

