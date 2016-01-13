(function(){
	var time = 800;
	var htmlbody = $('html, body');
	$('#button1').on('click',function(){
		console.log($('.screen2').offset().top);
		htmlbody.stop().stop().animate({
			scrollTop:$('.screen2').offset().top
		}, time);
	});
	$('#button2').on('click',function(){
		htmlbody.stop().stop().animate({
			scrollTop:$('.screen3').offset().top 
		}, time);
	});
	var map;
	var infowindow;
	var service;
	var initMap = function(){
		if (navigator.geolocation) {
			console.log('navigator.geolocation 1');
		    navigator.geolocation.getCurrentPosition(function(position) {
		    	console.log('navigator.geolocation 2');
		    	/*++for test*/
		    	/*geocoder = new google.maps.Geocoder();
		    	var pos;
				geocoder.geocode( { 'address': 'Белорецк'}, function(results, status) {
					console.log(results);
			    	pos = results[0].geometry.location;
				*/
			    /*--for test*/
			    var pos = {
			    	lat: position.coords.latitude,
			    	lng: position.coords.longitude
			    };
			    map = new google.maps.Map(document.getElementById('map'), {
				    center:pos,
				    zoom: 8
				});
				infowindow = new google.maps.InfoWindow();
				service = new google.maps.places.PlacesService(map);
				console.log(pos);
				var options = {
					query: 'Горнолыжный курорт',
					location:pos,
					radius:70000
				}
				service.textSearch(options,callback);
				//});//for test
		    }, function(positionError) {
		    	
		    	console.log(positionError.code);
		    	var message = '';
		    	switch(positionError.code){
		    		case 1:
		    			message = 'Необходимо разрешить определение местоположения.';
		    		break;
		    		case 2:
		    			message = 'Определить местоположение не удалось.';
		    		break;
		    	}
		    	$('#map').append('<div class="alert">'+message+'</div>');
		    });
		}else{
			$('#map').append('<div class="alert">Ваш браузер не поддерживает определение местоположения.</div>');
		    //handleLocationError(false, infoWindow, map.getCenter());
		}
		function callback(results, status){
			console.log(results);
		  if (status === google.maps.places.PlacesServiceStatus.OK) {
		    for (var i = 0; i < results.length; i++) {
		      createMarker(results[i]);
		    }
		  }
		}
		function createMarker(place) {
		  var placeLoc = place.geometry.location;
		  var marker = new google.maps.Marker({
		    map: map,
		    position: place.geometry.location,
		    title:place.name
		  });
		  google.maps.event.addListener(marker, 'click', function() {
		  	//GET DETAILS
			var request = {
			  placeId: place.place_id
			};
			var that = this;//place for marker on map
			service.getDetails(request, function(detailedPlace){
				console.log(detailedPlace);
				if(detailedPlace.photos){
					photoUrl = detailedPlace.photos[0].getUrl({maxHeight:200,maxWidth:200});//200x200
				}else{
					photoUrl = "imgs/no_image.png"
				}
				detailedPlace.rating===undefined ? detailedPlace.rating = 0 : detailedPlace.rating = detailedPlace.rating; 
				console.log(photoUrl);
				var iw = createInfoWindow(
					photoUrl,
					detailedPlace.name,
					detailedPlace.rating,
					detailedPlace.formatted_address,
					detailedPlace.international_phone_number,
					detailedPlace.website
				);
				//console.log(iw.html());
			    infowindow.setContent(iw.html());
			    infowindow.open(map, that);
			});
		  });
		}
		function createInfoWindow(imgSrc,name,raiting,address,tel,url){
			var wr = $('<div/>');//wrapper
			var infoWindow = $('<div/>',{'class':'maps-info-window'});
			var img = $('<div/>',{'class':'photo'}).append($('<img/>',{src:imgSrc}));
			var info = $('<div/>', {'class':'info'});
			var rows = [
				$('<div/>',{'class':'info-row name'}).append('<span>'+name+'</span>'),
				$('<div/>',{'class':'info-row rating'}).append('<span>Рейтинг: '+raiting+' из 5.0</span>'),
				$('<div/>',{'class':'info-row address'}).append('<span>'+address+'</span>')
			];
			if(tel!==undefined){
				rows.push($('<div/>',{'class':'info-row tel'}).append('<a href="tel:'+tel+'">'+tel+'</a>'));
			}
			if(url!==undefined){
				rows.push($('<div/>',{'class':'info-row url'}).append('<a href="'+url+'" target="_blank">'+url+'</span>'));
			}
			for(var i in rows){
				info.append(rows[i]);
			}
			wr.append(infoWindow.append(img,info));
			return wr;
		}
	}
	$('#button3').on('click',function(){
		var options = {
			html:'<div id="map"></div>',
			fixed:true,
			onComplete:function(){
				initMap();
			}
		}
		if(Modernizr.touchevents){
			options.width = '100%';
			options.height = '100%';
		}else{
			options.width = '80%';
			options.height = '80%';
		}
		$.colorbox(options);
	});
	$('.order-btn').on('click',function(){
		changeTrainer($('.select li[data-option="'+$(this).attr('data-trainer')+'"]'));
		htmlbody.stop().stop().animate({
			scrollTop:$('#main-footer').offset().top
		}, time);
	});
	//==========FORM===========
	//select
	if(Modernizr.csstransforms){
		$('.select').on('click',function(){
			$(this).toggleClass('sel-hidden');
		});
	}else{
		$('.select-dropover').hide();
		$('.select').on('click',function(){
			if($(this).find('.select-dropover').css('display')==='none'){
				$(this).find('.select-dropover').show();
			}else{
				$(this).find('.select-dropover').hide();
			}
		});
	}
	function changeTrainer($trainer){
		var text = $trainer.text();
		var val = $trainer.attr('data-option');
		$trainer.parents().eq(1).find('.select-view span').text(text);
		$trainer.parents().eq(1).find('.select-view input[name="trainer"]').val(val);
	}
	$('.select ul li').on('click',function(){
		changeTrainer($(this));
	});
	//inpuns
	$('.main-form-input').on('focus', function(){
		$(this).parent().addClass('active');
		if($(this).val()===$(this).attr('data-placeholder')){
			$(this).val('');
		}
	});
	$('.main-form-input').on('blur', function(){
		$(this).parent().removeClass('active');
		if($(this).val()===''){
			$(this).val($(this).attr('data-placeholder'));
		}
	});
	var validating = false;
	function validator($inputs){
		var valid = false;
		var endValidObjs = 0;//всего валидируемых объектов
		var currentValidObjs = 0;//текущее количество валидируемых объектов
		var duration = 1500;
		$inputs.each(function(){
			if($(this).val()==='' || $(this).val()===$(this).attr('data-placeholder')){
				alerting($(this),duration,'Заполните поле');
			}else{//not empty
				//regexps
				var val = $.trim($(this).val());
				switch($(this).attr('name')){
					case 'lead-name':
						if(!/^([a-zA-Zа-яА-Я]{2,}\s?[-]?\s?)+$/.test(val)){
							alerting($(this),duration,'Имя не корректно');
						}
					break;
					case 'lead-email':
						if(!/^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/.test(val)){
							alerting($(this),duration,'Email не корректен');
						}
					break;
					case 'lead-phone':
						if(!/^\+*\d{5,}$/.test(val)){
							alerting($(this),duration,'Телефон не корректен');
						}
					break;
					case 'lead-city':
						if(!/^([a-zA-Zа-яА-Я]{2,}\s?[-]?\s?)+$/.test(val)){
							alerting($(this),duration,'Город не корректен');
						}
					break;
				}
			}
		});
		function alerting($input,duration,message){
			endValidObjs++;
			$input.parent().addClass('alert');
			var val = $input.val();
			$input.val(message);
			var parent = $input.parent();
			var timeout = setTimeout(function(){
				console.log('timeout');
				console.log(parent.attr('class'));
				parent.removeClass('alert');
				$input.val(val);
				currentValidObjs++;
				if(currentValidObjs === endValidObjs){
					validating=false;//конец валидации
					console.log('end validation');
				}
			},duration);
		}
		console.log(endValidObjs,validating);
		if(endValidObjs===0){
			valid = true;
			validating = false;
		}
		return valid;
	}
	var sanding = false;
	$('#main-form .submit').on('click',function(e){
		e.preventDefault();
		console.log('validating:',validating);
		if(!validating && !sanding){//если уже не валидируется и не отправилось
			validating = true;
			if(validator($('.input-block input'))){
				ajaxSubmit();
			}
		}
	});
	function ajaxSubmit(){
		sanding = true;
		var message = {};
	    $.ajax({
	        url: 'handler.php',
	        type: 'post',
	        //dataType: 'json',
	        data: $('#main-form').serialize(),
	        success: function(data) {
	        	console.log('done');
	        	message.main = 'Заявка успешно отправленна';
	        	message.sub = 'В ближайшее время мы свяжемся с тобой';
	        },
	        error:function(jqXHR,textStatus,errorThrown){
				console.log('none',textStatus,jqXHR);
				message.main  = 'Отправить заявку не получилось';
	        	message.sub = 'Попробуй позже';
			},
			complete:function(){
				sanding = false;
				var html = $('<div/>',{'class':'message'});
				var row1 = $('<div/>',{'class':'x32'}).append($('<span/>').text(message.main));
				var row2 = $('<div/>',{'class':'x16'}).append($('<span/>').text(message.sub));
				var button = $('<div/>',{'class':'more-btn',id:'button-back'}).text('Обратно');
				html.append(row1,row2,button);
				var options = {
					html:html,
					fixed:true,
					className:'response-box'
				}
				if(Modernizr.touchevents){
					options.width = '100%';
					options.height = '100%';
				}else{
					options.width = '80%';
					options.height = '80%';
				}
				$.colorbox(options);
			}
	    });
	}
	$('body').on('click','#button-back',function(){
		$.colorbox.close();
	});

})();