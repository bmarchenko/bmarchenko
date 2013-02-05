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
			dateFormat:	'dd-mm-yy',
			dayNames:	['Âîñêðåñåíüå', 'Ïîíåäåëüíèê', 'Âòîðíèê', 'Ñðåäà', '×åòâåðã', 'Ïÿòíèöà', 'Ñóááîòà'],
			dayNamesMin:['Âñ', 'Ïí', 'Âò', 'Ñð', '×ò', 'Ïò', 'Ñá'],
			firstDay:	1,
			maxDate:	'+44',
			minDate:	'',
			monthNames:	[	'ßíâàðü', 'Ôåâðàëü', 'Ìàðò', 'Àïðåëü', 'Ìàé', 'Èþíü',
							'Èþëü', 'Àâãóñò', 'Ñåíòÿáðü', 'Îêòÿáðü', 'Íîÿáðü', 'Äåêàáðü	'],
			buttonImage: 'rezerv/img/calendar.jpg',
			buttonImageOnly: true,
			buttonText: 'Âûáðàòü',
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
					$.getJSON('http://www.pz.gov.ua/rezerv/aj_stations.php?jsoncallback=?', {'stan':value, dataType: 'xml', "complete":function(data) { alert(data);  }}, onAjaxSuccess);
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
					nom=station.nom;

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

	//	<table cellspacing="10">
    //		<tr><td class="r">Ñòàíöèÿ îòïðàâëåíèÿ:</td><td class="l"><span id="g60stotpr">sd</span></td><tr>
	//		<tr><td class="r">Ñòàíöèÿ íàçíà÷åíèÿ:</td><td class="l"><span id="g60stprib">asd</span></td><tr>
    //		<tr><td class="r">Äàòà îòïðàâëåíèÿ:</td><td class="l"><span id="g60date">asd</span></td><tr>
    //	</table>


//		$('#mesta').click(function(){
//
//			$("#gXXparams > #params").empty();
//			$("#gXXparams > #gXXzag > div").text('ÍÀËÈ×ÈÅ ÑÂÎÁÎÄÍÛÕ ÌÅÑÒ:');
//			$("#gXXparams > #params").append('<tr><td class="r">Îòïðàâëåíèå:</td><td class="l"><span class="orange" id="timeOtpr"></span><span id="g60stotpr">'+$("#stan1").val()+'</span></td><tr>');
//			$("#gXXparams > #params").append('<tr><td class="r">Ïðèáûòèå:</td><td class="l"><span class="orange" id="timePrib"></span><span id="g60stprib">'+$("#stan2").val()+'</span></td><tr>');
//			$("#gXXparams > #params").append('<tr><td class="r">Äàòà îòïðàâëåíèÿ:</td><td class="l"><span id="g60date">'+$("#date").val()+'</span></td><tr>');
//			$("#gXXparams > #verniteVvod").html('<input id="backToEnter" type="button" value="Èçìåíèòü äàííûå" title="Èçìåíèòü äàííûå" >');
//			//$("#g60stotpr").text($("#stan1").val());
//			//$("#g60stprib").text($("#stan2").val());
//			//$("#g60date").text($("#date").val());
//			$("#enterForm").hide();
//			$("#gXXparams").fadeIn(500);
//
//			$('#backToEnter').click(function(){
//				init_1st_form();
//			})
//
//			g60("kstotpr="+$('#numstan1').val()+"&kstprib="+$('#numstan2').val()+"&sdate="+$('#date').val());
//
//		})

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

