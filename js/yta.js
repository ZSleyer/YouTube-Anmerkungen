//Globale Variablen/Arrays
var xmlchange = '0',
	xmlsource = '',
	annotationids = [],
	annotationidequalannocount = [],
	annotationnames = [],
	annotationurls = [],
	annotationstyles = [],
	annotationtypes = [],
	annotationtimes = [],
	annotationtimestartend = [],
	annotationtimeminus = [],
	annotationlink = [],
	annotationhighlightfix = [],
	accountblocking = 'true',
	ytuser = '';
	username = '',
	workcounter = 0,
	workcountergoal = 0,
	network = [],
	ytidlist = [],
	userid = [],
	useridfound = [],
	apikey = 'Als ob ich dir meinen API-Key gebe!';

function alertmessage(message) {
	// Meldungen
	if ($('#alert').length) {
		$("#alert").remove();
	}
	if ($('#alertoverlay').length) {
		$("#alertoverlay").remove();
	}
	$('body').prepend('<div id="alert" style="display:none;"><div id="alert-container"><div id="alert-content">' + message + '</div></div></div>');
	$('#alert').fadeIn('normal');
	$('body,html').animate({
		scrollTop: 0
	}, 800);
	$(document.body).on("click", '#alert', function() {
		if ($('#alert').is(':visible')) {
			$('#alert').fadeOut('normal', function() {
				$(this).remove();
			});
		}
	});
};

function loading() {
	if ($('#loading').length) {
		$("#loading").remove();
	}
	if ($('#loadingoverlay').length) {
		$("#loadingoverlay").remove();
	}
	$('body').prepend('<div id="loading" style="display:none;"><div id="loading-container"><div id="loading-content"><div id="spinningSquaresG"><div id="spinningSquaresG_1" class="spinningSquaresG"></div><div id="spinningSquaresG_2" class="spinningSquaresG"></div><div id="spinningSquaresG_3" class="spinningSquaresG"></div><div id="spinningSquaresG_4" class="spinningSquaresG"></div><div id="spinningSquaresG_5" class="spinningSquaresG"></div><div id="spinningSquaresG_6" class="spinningSquaresG"></div><div id="spinningSquaresG_7" class="spinningSquaresG"></div><div id="spinningSquaresG_8" class="spinningSquaresG"></div></div></div></div></div>');
	$('#loading').fadeIn(60);
	$(document.body).on("click", '#loading', function() {
		if ($('#loading').is(':visible')) {
			$('#loading').fadeOut('normal', function() {
				$(this).remove();
			});
		}
	});
}

//Starting the Tool on Editing Page
function start(){
	$.ajax({
		url: 'https://'+window.location.host + window.location.pathname+'?status=true',
		type: 'GET',
		dataType: 'html',
		statusCode: {
			404: function() {
				document.body.innerHTML = "";
				alertmessage('Oops! Something went wrong!');
				return false;
			}
		},
		beforeSend: function() {
			loading();
			document.title = "Lade Komponenten, bitte warten!";
		},
		complete: function() {
			document.title = 'Startseite - YTA-v5 - ZSleyer.de';
		},
		success: function(response) {
			var status = parseFloat(response);
			if (status == 0) {
				alertmessage('Der Wartungsmodus ist aktiv!');
			} else {
				if(status == 1) {
					$('#status').text('waiting...');
					$('#status').show();
					
					$('#status').text('authentication');
					$.ajax({
						url: 'https://'+window.location.host + window.location.pathname+'?getusername=true',
						type: 'GET',
						dataType: 'html',
						async: false,
						statusCode: {
							404: function() {
								alertmessage('Ops, something went wrong!');
								return false;
							}
						},
						success: function(response) {
							username = response;
							$('#status').text('authenticated');
						}
					});
					$.ajax({
						url: 'https://www.youtube.com/account_advanced',
						type: 'GET',
						dataType: 'html',
						async: false,
						statusCode: {
							404: function() {
								alertmessage('Ops, something went wrong!');
								return false;
							}
						},
						success: function(data) {
							//ytuser = $(data).find('span.yt-user-name.g-hovercard').text();
							var counter = 0;
							do{
								window.userid = $(data).find('.account-subsection p:nth-child(' + (counter + 1) + ')').text().split(' ');
								counter++;
							} while ($(data).find('.account-subsection p:nth-child(' + counter + ')').text().indexOf("YouTube-Kanal-ID: ") != 1);
							$.getJSON('https://www.googleapis.com/youtube/v3/channels?part=snippet&id='+ userid +'&fields=items%2Fsnippet%2Flocalized&key='+ apikey,
								function(data){
									var ytuser = data.items[0].snippet.localized.title;
									$('#username').text(ytuser);
								}
							);
							$.getJSON('https://www.googleapis.com/youtube/v3/channels?part=snippet&id='+ userid +'&fields=items%2Fsnippet%2Fthumbnails&key='+ apikey,
								function(data){
									$('#userava').replaceWith('<img src="'+ data.items[0].snippet.thumbnails.default.url +'">');
								}
							);
							ytidlist.forEach(function(id) {
							if(userid[1].indexOf(id) >= 0){
								$('#ytuser').css({'color': 'green'});
								$('#ytuser').text('verified');
								accountblocking = 'false';
								return false;
							}
							})
							if (accountblocking == 'true') {
								$.ajax({
								url: 'https://www.youtube.com/features',
								type: 'GET',
								dataType: 'html',
								async: false,
								statusCode: {
									404: function() {
										alertmessage('Ops, something went wrong!');
										return false;
									}
								},
								success: function(data) {
									network = $(data).find('.account-info strong').text().split(' ');
									if(network[8] == 'GamingClerks'){
										$('#ytuser').css({'color': 'green'});
										$('#ytuser').text('verified');
										accountblocking = 'false';
										return false;
									}else{
										if (accountblocking == 'true') {
											$('#ytuser').css({'color': 'red'});
											$('#ytuser').text('not verified');
											alertmessage('Du bist kein Partner im GamingClerks Netzwerk!')
										} else {
											$('#ytuser').text('verified');
										}
									}
								}
							});
							}
						}
					});
					if (username == '') {
						alertmessage('Du bist nicht Angemeldet.');
						document.getElementById('status').innerHTML = "error";
					} else {
						$('#status').text('loading');
						//editor apply button
						document.getElementById('xml_change_button').onclick = function xmlhack() {
							if (accountblocking == 'true') {
								alertmessage('Dein YouTube-Account wird nicht unterstützt!');
								return;
							}
							var edit = document.getElementById('xml-anno-edit-id').value;
							if (edit == '0') {
								alertmessage('Du musst eine Anmerkung auswählen!');
								return;
							} else {
								xmlchange = '1';
								annotationnames[edit - 1] = document.getElementById('xml-anno-edit-text').value;
								annotationurls[edit - 1] = document.getElementById('xml-anno-edit-link').value;
								annotationtimeminus[edit * 2 - 2] = document.getElementById('xml-anno-edit-custom-time').value;
								annotationtimeminus[edit * 2 - 1] = document.getElementById('xml-anno-edit-custom-time').value;
								annotationtimes[edit * 2 - 2] = document.getElementById('xml-anno-edit-timestart').value;
								annotationtimes[edit * 2 - 1] = document.getElementById('xml-anno-edit-timeend').value;
								if (document.getElementById('xml-anno-edit-link-op').value == '1') {
									annotationlink[edit - 1] = 'previous';
								} else {
									if (document.getElementById('xml-anno-edit-link-op').value == '2') {
										annotationlink[edit - 1] = 'next';
									} else {
										annotationlink[edit - 1] = 'donothing';
									}
								}
								if (document.getElementById('xml-anno-edit-start-op').value == '1') {
									annotationtimestartend[edit * 2 - 2] = 'end_start';
									annotationtimestartend[edit * 2 - 1] = 'end_end';
								} else {
									annotationtimestartend[edit * 2 - 2] = 'no';
									annotationtimestartend[edit * 2 - 1] = 'no';
								}
								xml_edit_display();
								
								if (annotationtypes[edit - 1] == 'highlight') {
									$('#xml-anno-edit-id  option[value="' + edit + '"]').replaceWith("<option value='" + edit + "'>" + annotationidequalannocount[edit] + ": Spotlight - " + annotationurls[edit - 1] + "</option>");
									var logname = ': Spotlight - ' +annotationurls[edit - 1];
								} else {
									$('#xml-anno-edit-id  option[value="' + edit + '"]').replaceWith("<option value='" + edit + "'>" + annotationidequalannocount[edit] + ": " + annotationnames[edit - 1] + "</option>");
									var logname = ': ' +annotationnames[edit - 1];
								}
								
								$('#xml-anno-edit-id  option[value="' + edit + '"]').attr('selected', true);
								var logmessage = '"' + annotationidequalannocount[edit] + logname + '" wurde erfolgreich bearbeitet!';
								cyalog(logmessage);
							};
						};
						//retrieve button
						document.getElementById('retrieve_annotations_button').onclick = function getauthtokenandxml() {
							if (accountblocking == 'true') {
								alertmessage('Dein YouTube-Account wird nicht unterstützt!');
								return;
							}
							if ($('#video_id').val().length == 0) {
								alertmessage('Bevor du fortfahren kannst, musst du die YouTube Video URL in das vorgesehende Feld eingeben!');
							} else {
								var video_id = extract_ids(document.getElementById('video_id').value);
								getxmlsource(video_id);
								xml_edit_getannotation();
							}
						};
						//copy button
						document.getElementById('copy_annotations_button').onclick = function copyannotations() {
							if (accountblocking == 'true') {
								alertmessage('Dein YouTube-Account wird nicht unterstützt!');
								return;
							}
							var ids = document.getElementById('ids');
							ids.value = extract_ids(ids.value);
							if ($('#ids').val().length == 0) {
								alertmessage('Bevor du fortfahren kannst, musst du zunächst mindestens ein Video angebene, welches die Anmerkungen erhalten soll!');
								return;
							};
							var xmldata = getxml();
							if (!xmldata) return;
							var ret = xmldata.match(/<annotation /g);
							var minushighlightText = 0;
							$(xmlsource).find('annotation').each(function(i) {
								if ($(this).attr('style') == 'highlightText') {
									minushighlightText = minushighlightText+1;
								}
							});
							var anonum = (ret != null) ? ret.length : 0;
							var num = anonum - minushighlightText;
							
							
							
							ids = ids.value.split('\n');
							var videoids = [];
								ids.forEach(function(id) {
									var ret = /^([^ #]+)/.exec(id);
									if (ret == null) return;
									var id = ret[1];
									videoids.push(id);
								})
										
								//overviewlog
								if (workcounter == workcountergoal) {
									workcounter = 0;
									workcountergoal = videoids.length;
									$('#workcounter').text('0')
									$('#workcountergoal').text(workcountergoal);
								} else{
									workcountergoal = parseInt(workcountergoal) + videoids.length;
									$('#workcountergoal').text(workcountergoal);
								}
								if ($('#working-log-container').is(':hidden')) {
									$('#working-log-container').show('normal');
								}
								
								videoids.forEach(function(id, index) {
								var auth_token = '';
								$.ajax({
									url: 'https://www.youtube.com/my_videos_annotate?v=' + id,
									type: 'GET',
									dataType: 'html',
									async: true,
									success: function(response) {
										var a_t = /auth_token.*?:.*?"(.*?)"/.exec(response);
										if (a_t == null) {
											var logmessage = 'Anmerkungen für <a href="https://www.youtube.com/my_videos_annotate?v=' + id + '" target="_blank">' + id + '</a> konnten nicht kopiert werden, stelle sicher das dir das Video auch gehört!';
											cyalog(logmessage);
											return;
										} else {
											auth_token = a_t[1];
											if (xmlchange == '1') {
												$.ajax({
													url: 'https://www.youtube.com/edit?o=U&video_id=' + id,
													type: 'GET',
													dataType: 'html',
													statusCode: {
														404: function() {
															var logmessage = 'fehler';
															cyalog(logmessage);
														}
													},
													success: function(response) {
														var durationresponse = $(response).find('#video-info dl dd:eq(2)').html();
														var dsplit = durationresponse.split(':'); // split it at the colons

														// minutes are worth 60 seconds. Hours are worth 60 minutes.
														var duration = (+dsplit[0]) * 60 + (+dsplit[1]);

														if (duration) {
															//CHANG XML SOURCE
															var xmldatachange = $.parseXML(xmldata)
															$(xmldatachange).find('annotation').each(function(i) {
																if (annotationlink[i] == 'previous') {
																	if (videoids[index + 1]) {
																		$(this).find('url').attr('value', 'http://www.youtube.com/watch?v=' + videoids[index + 1]);
																	} else {
																		$(this).find('url').attr('value', annotationurls[i]);
																	}
																}
																if (annotationlink[i] == 'next') {
																	if (videoids[index - 1]) {
																		$(this).find('url').attr('value', 'http://www.youtube.com/watch?v=' + videoids[index - 1]);
																	} else {
																		$(this).find('url').attr('value', annotationurls[i]);
																	}
																}
																if (annotationlink[i] == 'donothing') {
																	$(this).find('url').attr('value', annotationurls[i]);
																}
																$(this).attr('style', annotationstyles[i]);
																$(this).attr('id', annotationids[i]);
																$(this).find('TEXT', annotationnames[i]);
																i + 1;
															});
															$(xmldatachange).find('rectRegion').each(function(i) {
																if (annotationtimestartend[i] == 'end_start') {
																	var ms1 = annotationtimes[i + 1]; // your input string
																	var a1 = ms1.split(':'); // split it at the colons
																	if (a1[2]) {
																		if (a1[0] == '00') {
																			var annotationtimeend = (+a1[1]) * 60 + (+a1[2]);
																		} else {
																			var annotationtimeend = (+a1[0]) * 60 + (+a1[1]) * 60 + (+a1[2]);
																		}
																	} else {
																		var annotationtimeend = (+a1[0]) * 60 + (+a1[1]);
																	}
																	var ms2 = annotationtimes[i]; // your input string
																	var a2 = ms2.split(':'); // split it at the colons
																	if (a1[2]) {
																		if (a1[0] == '00') {
																			var annotationtimestart = (+a1[1]) * 60 + (+a1[2]);
																		} else {
																			var annotationtimestart = (+a1[0]) * 60 + (+a1[1]) * 60 + (+a1[2]);
																		}
																	} else {
																		var annotationtimestart = (+a2[0]) * 60 + (+a2[1]);
																	}
																	var annoxmlchangeendtime = parseFloat(duration) - (annotationtimeend - annotationtimestart) - parseFloat(annotationtimeminus[i]);
																	$(this).attr('t', annoxmlchangeendtime.toString().toHHMMSS());
																	console.log(annoxmlchangeendtime.toString().toHHMMSS())
																} else {
																	if (annotationtimestartend[i] == 'end_end') {
																		var annoxmlchangeendtime = parseFloat(duration) - parseFloat(annotationtimeminus[i]);
																		$(this).attr('t', annoxmlchangeendtime.toString().toHHMMSS());
																		console.log(annoxmlchangeendtime.toString().toHHMMSS())
																	} else {
																		if (annotationtimestartend[i] == 'no') {
																			$(this).attr('t', annotationtimes[i]);
																		}
																	}
																}
																i + 1;
															});
															//copy new xml source
															var xmldatachangefinal = xmlToString(xmldatachange);
															copy(xmldatachangefinal, id, auth_token, num);
														} else {
															alertmessage('FEHLER: Konnte die Videodauer nicht abrufen!');
															return;
														}
													}
												});
											} else {
												copy(xmldata, id, auth_token, num);
											}
										}
									}
								});
							});
						};
						//publishbutton
						document.getElementById('publish_annotations_button').onclick = function publishannotations() {
							if (accountblocking == 'true') {
								alertmessage('Dein YouTube-Account wird nicht unterstützt!');
								return;
							}
							var ids = document.getElementById('ids');
							ids.value = extract_ids(ids.value);
							if ($('#ids').val().length == 0) {
								alertmessage('Bevor du fortfahren kannst, musst du zunächst mindestens ein Video angeben, von welchem die Anmerkungen veröffentlicht werden sollen!');
								return;
							};
							ids = ids.value.split('\n');
							var videoids = [];
								ids.forEach(function(id) {
									var ret = /^([^ #]+)/.exec(id);
									if (ret == null) return;
									var id = ret[1];
									videoids.push(id);
								})
										
								//overviewlog
								if (workcounter == workcountergoal) {
									workcounter = 0;
									workcountergoal = videoids.length;
									$('#workcounter').text('0')
									$('#workcountergoal').text(workcountergoal);
								} else{
									workcountergoal = parseInt(workcountergoal) + videoids.length;
									$('#workcountergoal').text(workcountergoal);
								}
								if ($('#working-log-container').is(':hidden')) {
									$('#working-log-container').show('normal');
								}
								
								videoids.forEach(function(id) {
								var ret = /^([^ #]+)/.exec(id);
								if (ret == null) return;
								var id = ret[1];
								var auth_token = '';
								$.ajax({
									url: 'https://www.youtube.com/my_videos_annotate?v=' + id,
									type: 'GET',
									dataType: 'html',
									async: true,
									success: function(response) {
										var a_t = /auth_token.*?:.*?"(.*?)"/.exec(response);
										if (a_t == null) {
											var logmessage = 'Anmerkungen für <a href="https://www.youtube.com/my_videos_annotate?v=' + id + '" target="_blank">' + id + '</a> konnten nicht veröffentlicht werden, stelle sicher das dir das Video auch gehört!';
											cyalog(logmessage);
											return;
										} else {
											auth_token = a_t[1];
											// publish
											publish(id, auth_token);
										}
									}
								});
							});
						};
						//delete button
						document.getElementById('delete_annotations_button').onclick = function deleteanno() {
							if (accountblocking == 'true') {
								alertmessage('Dein YouTube-Account wird nicht unterstützt!');
								return;
							}
							var ids = document.getElementById('ids');
							ids.value = extract_ids(ids.value);
							if ($('#ids').val().length == 0) {
								alertmessage('Bevor du fortfahren kannst, musst du zunächst mindestens ein Video angeben, von welchem die Anmerkungen gelöscht werden sollen!');
								return;
							};
							if (!confirm('Bist du dir sicher, dass du alle Anmerkungen des/der Videos löschen möchtest?')) return;
							ids = ids.value.split('\n');
							var videoids = [];
								ids.forEach(function(id) {
									var ret = /^([^ #]+)/.exec(id);
									if (ret == null) return;
									var id = ret[1];
									videoids.push(id);
								})
										
								//overviewlog
								if (workcounter == workcountergoal) {
									workcounter = 0;
									workcountergoal = videoids.length;
									$('#workcounter').text('0')
									$('#workcountergoal').text(workcountergoal);
								} else{
									workcountergoal = parseInt(workcountergoal) + videoids.length;
									$('#workcountergoal').text(workcountergoal);
								}
								if ($('#working-log-container').is(':hidden')) {
									$('#working-log-container').show('normal');
								}
								
								videoids.forEach(function(id) {
								var ret = /^([^ #]+)/.exec(id);
								if (ret == null) return;
								var id = ret[1];
								var auth_token = '';
								$.ajax({
									url: 'https://www.youtube.com/my_videos_annotate?v=' + id,
									type: 'GET',
									dataType: 'html',
									async: true,
									success: function(response) {
										var a_t = /auth_token.*?:.*?"(.*?)"/.exec(response);
										if (a_t == null) {
											var logmessage = 'Anmerkungen für <a href="https://www.youtube.com/my_videos_annotate?v=' + id + '" target="_blank">' + id + '</a> konnten nicht gelöscht werden, stelle sicher das dir das Video auch gehört!';
											cyalog(logmessage);
											return;
										} else {
											auth_token = a_t[1];
											deleteannotationsq(id, auth_token);
										}
									}
								});
							});
						};
						$('#status').text('...');
						//start
						function startup() {
							$('#status').text('finished')
							$('#status').hide('slow', function() {
								document.title = 'Startseite - YTA-v5 - ZSleyer.de';
								if ($('#loading').is(':visible')) {
									$('#loading').fadeOut('normal', function() {
										$(this).remove();
									});
								}
								if (accountblocking == 'true') {
									if (document.cookie.indexOf('contract6') >= 0) {
										$('#areaname').text('Startseite')
										document.title = 'Startseite - YTA-v5 - ZSleyer.de';
										alertmessage('Dein YouTube-Kanal ist nicht autorisiert, du bist kein Partner im GamingClerks Netzwerk oder du bist nicht eingeloggt!');
									} else {
										alertmessage('Du bist nicht autorisiert dieses Tool zu verwenden!');
									}

								} else {
									if (document.cookie.indexOf('contract6') >= 0) {
										$('#areaname').text('Startseite')
										document.title = 'Startseite - YTA-v5 - ZSleyer.de';
										$('#tool-information').hide('normal');
										$('.start-up-after').show('normal');
									} else {
										$('#declinerules').show('normal', function() {
											$('#acceptrules').show('normal');
										});
										document.getElementById('acceptrules').onclick = function rules() {
											$.cookie('contract6', 'accept', {
												path: '/',
												expires: 365000
											});
											$('#areaname').text('Startseite')
											document.title = 'Startseite - YTA-v5 - ZSleyer.de';
											$('#tool-information').hide('normal');
											$('.start-up-after').show('normal');
										}
									}

								}
							});
						};

						//time function
						function checkTime(i) {
							if (i < 10) {
								i = "0" + i;
							}
							return i;
						}

						function Time() {
							var today = new Date();
							var h = today.getHours();
							var m = today.getMinutes();
							var s = today.getSeconds();
							// add a zero in front of numbers<10
							m = checkTime(m);
							s = checkTime(s);
							time = (h + ":" + m + ":" + s);
							return time;
						}
						//cyalog

						function cyalog(message) {
							if ($('#info').is(':visible')) {
								$('#info').hide('normal', function() {
									$('#log-container').show('normal', function() {
										$('#log').prepend('<div class="cya-log-history"><span>' + Time() + ':</span> ' + message + '</div>');
										if ($('.cya-log-history').is(':hidden')) {
											$('.cya-log-history').show('normal');
										}
									});
								});
							} else {
								$('#log').prepend('<div class="cya-log-history"><span>' + Time() + ':</span> ' + message + '</div>');
								if ($('.cya-log-history').is(':hidden')) {
									$('.cya-log-history').show('normal');
								}
							}
						}


						//extract video ids
						function extract_ids(str) {
							if (str == null) return str;
							return str.replace(/.*?([\?&]v=|[\?&]video_id=|youtu.be\/)([^&\?#\s]+)[\S]*/g, '$2');
						}
						//xmlcheck

						function getxml() {
							var data = xmlsource;
							if (!data) return alertmessage('Bevor du fortfahren kannst, musst du zuerst zu kopierende Anmerkungen aburfen!');
							data = data.replace(/<\?xml[^>]*\?>/, ''); //https://bugzilla.mozilla.org/show_bug.cgi?id=336551
							data = data.replace(/annotations>/g, 'updatedItems>'); //rename <annotations> to <updatedItems>
							// insert requestHeader and authenticationHeader, if not already present
							var ret = /<authenticationHeader/.exec(data);
							if (ret == null) {
								data = data.replace(/<document.*?>/, '$&<requestHeader video_id="" /><authenticationHeader auth_token="" />');
							}
							// remove InVideo Programming
							data = data.replace(/<annotation [^>]*?id="channel:[\S\s]*?<\/annotation>/g, '');
							// remove EndCard Programming
							data = data.replace(/<annotation [^>]*?id="video:[\S\s]*?<\/annotation>/g, '');
							return data;
						}

						//Messages
						function alertmessage(message) {
							// Meldungen
							if ($('#alert').length) {
								$("#alert").remove();
							}
							if ($('#alertoverlay').length) {
								$("#alertoverlay").remove();
							}
							$('body').prepend('<div id="alert" style="display:none;"><div id="alert-container"><div id="alert-content">' + message + '</div></div></div>');
							$('#alert').fadeIn('normal');
							$('body,html').animate({
								scrollTop: 0
							}, 800);
							$(document.body).on("click", '#alert', function() {
								if ($('#alert').is(':visible')) {
									$('#alert').fadeOut('normal', function() {
										$(this).remove();
									});
								}
							});
						}
						//Request XML-Source Chrome

						function getxmlsource(video_id) {
							$.ajax({
								url: 'https://www.youtube.com/annotations_auth/read2?video_id=' + video_id, //new: https://www.youtube.com/annotations_auth/read2?video_id=  old: https://www.youtube.com/annotations_invideo?features=1&legacy=1&video_id=
								type: 'GET',
								dataType: 'html',
								statusCode: {
									404: function() {
										alertmessage('Die eingebene Video(URL) scheint nicht gültig zu sein!');
										var logmessage = 'Anmerkungen konnten nicht abgerufen werden!';
										cyalog(logmessage);
									},
									403: function() {
										alertmessage('Du bist mit dem falschen YouTube-Account angemeldet oder das Video <a href="https://www.youtube.com/watch?v=' + video_id + '" target="_blank">Video ' + video_id + '</a> gehört nicht dir!');
										var logmessage = 'Du bist mit dem falschen YouTube-Account angemeldet oder das <a href="https://www.youtube.com/watch?v=' + video_id + '" target="_blank">Video ' + video_id + '</a> gehört nicht dir!';
										cyalog(logmessage);
									}

								},
								success: function(response) {
									var data = response.replace(/<annotation [^>]*?id="channel:[\S\s]*?<\/annotation>/g, '');
									var ret = data.match(/<annotation /g);
									xmlsource = data;
									xmlchange = '0';
									var minushighlightText = 0;
									$(data).find('annotation').each(function(i) {
										if ($(this).attr('style') == 'highlightText') {
											minushighlightText = minushighlightText + 1;
										}
									});
									var num = (ret != null) ? ret.length : 0;
									xml_edit_getannotation(data);
									$('.noanno').hide('normal');
									$('.annoready').show('normal');
									var anonum = num - minushighlightText;
									var logmessage = anonum + ' Anmerkungen wurden erfolgreich abgerufen.';
									cyalog(logmessage);
								}
							});
						}

						//STRING TO HH:MM:SS
						String.prototype.toHHMMSS = function() {
							var sec_num = parseInt(this, 10); // don't forget the second param
							var hours = Math.floor(sec_num / 3600);
							var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
							var seconds = sec_num - (hours * 3600) - (minutes * 60);
							if (hours < 10) {
								hours = "0" + hours;
							}
							if (minutes < 10) {
								minutes = "0" + minutes;
							}
							if (seconds < 10) {
								seconds = "0" + seconds;
							}
							var time = hours + ':' + minutes + ':' + seconds + '.000';
							return time;
						}

						function xml_edit_getannotation(data) {
							annotationids = [];
							annotationnames = [];
							annotationurls = [];
							annotationstyles = [];
							annotationtimes = [];
							annotationtimestartend = [];
							annotationtimeminus = [];
							annotationlink = [];
							$("#xml-anno-edit-id").empty().append("<option value='0' selected='selected'>--</option>");
							$("#xml-anno-edit-typ").val('0');
							$("#xml-anno-edit-link-op").val('0');
							$("#xml-anno-edit-start-op").val('0');
							document.getElementById('xml-anno-edit-text').disabled = true;
							document.getElementById('xml-anno-edit-link').disabled = true;
							document.getElementById('xml-anno-edit-link-op').disabled = true;
							document.getElementById('xml-anno-edit-start-op').disabled = true;
							document.getElementById('xml-anno-edit-custom-time').disabled = true;
							document.getElementById('xml-anno-edit-timestart').disabled = true;
							document.getElementById('xml-anno-edit-timeend').disabled = true;
							document.getElementById('xml-anno-edit-text').value = '';
							document.getElementById('xml-anno-edit-link').value = '';
							document.getElementById('xml-anno-edit-custom-time').value = '';
							document.getElementById('xml-anno-edit-timestart').value = '';
							document.getElementById('xml-anno-edit-timeend').value = '';
							document.getElementById('xml-anno-edit-time').value = '';
							var annocount = 1;
							$(data).find('annotation').each(function(i) {
								var annotationstyle = $(this).attr('style');
								var annotationtype = $(this).attr('type');
								var annotationid = $(this).attr('id');
								var annotationurl = $(this).find('url').attr('value');
								var annotationname = $(this).find('TEXT').text();
								var select = $('#xml-anno-edit-id');

								if ($(this).attr('style') == 'highlightText') {
									//skip
								} else {
									if ($(this).attr('type') == 'highlight') {
										annotationidequalannocount[i + 1] = annocount;
										select.append("<option value='" + (i + 1) + "'>" + annocount + ": Spotlight - " + annotationurl + "</option>");
										annocount = annocount + 1;
									} else {
										annotationidequalannocount[i + 1] = annocount;
										select.append("<option value='" + (i + 1) + "'>" + annocount + ": " + annotationname + "</option>");
										annocount = annocount + 1;
									}
								}
								annotationids.push(annotationid);
								annotationnames.push(annotationname);
								annotationurls.push(annotationurl);
								annotationstyles.push(annotationstyle);
								annotationtypes.push(annotationtype);
								annotationlink.push('donothing');
							});
							$(data).find('rectRegion').each(function() {
								var annotime = $(this).attr('t').split(".")[0].split(":");
								if (annotime[2]) {
									var time = annotime[0] + ':' + annotime[1] + ':' + annotime[2];
								} else {
									var time = annotime[0] + ':' + annotime[1];
								}
								annotationtimestartend.push('no');
								annotationtimeminus.push('0');
								annotationtimes.push(time);
							});
							document.getElementById('xml-anno-edit-id').disabled = false;
						}

						function xml_edit_display() {
							var anno = document.getElementById('xml-anno-edit-id').value;
							if (annotationstyles[anno - 1] == 'anchored') {
								$("#xml-anno-edit-typ").val('1');
							} else {
								if (annotationstyles[anno - 1] == 'popup') {
									$("#xml-anno-edit-typ").val('2');
								} else {
									if (annotationstyles[anno - 1] == 'title') {
										$("#xml-anno-edit-typ").val('3');
									} else {
										if (annotationtypes[anno - 1] == 'highlight') {
											$("#xml-anno-edit-typ").val('4');
										} else {
											if (annotationstyles[anno - 1] == 'label') {
												$("#xml-anno-edit-typ").val('5');
											} else {
												$("#xml-anno-edit-typ").val('0');
												document.getElementById('xml-anno-edit-text').value = '';
											}
										}
									}
								}
							}
							if (annotationtimestartend[anno * 2 - 2] == 'end_start') {
								$("#xml-anno-edit-start-op").val('1');
							} else {
								$("#xml-anno-edit-start-op").val('0');
							}
							if (annotationlink[anno - 1] == 'previous') {
								$("#xml-anno-edit-link-op").val('1');
							} else {
								if (annotationlink[anno - 1] == 'next') {
									$("#xml-anno-edit-link-op").val('2');
								} else {
									$("#xml-anno-edit-link-op").val('0');
								}
							}
							if (anno == '0') {
								document.getElementById('xml-anno-edit-text').disabled = true;
								document.getElementById('xml-anno-edit-link').disabled = true;
								document.getElementById('xml-anno-edit-link-op').disabled = true;
								document.getElementById('xml-anno-edit-start-op').disabled = true;
								document.getElementById('xml-anno-edit-custom-time').disabled = true;
								document.getElementById('xml-anno-edit-timestart').disabled = true;
								document.getElementById('xml-anno-edit-timeend').disabled = true;
								document.getElementById('xml-anno-edit-text').value = '';
								document.getElementById('xml-anno-edit-link').value = '';
								document.getElementById('xml-anno-edit-custom-time').value = '';
								document.getElementById('xml-anno-edit-timestart').value = '';
								document.getElementById('xml-anno-edit-timeend').value = '';
								document.getElementById('xml-anno-edit-time').value = '';
							} else {
								if (annotationtypes[anno - 1] == 'highlight') {
									document.getElementById('xml-anno-edit-text').disabled = true;
								} else {
									document.getElementById('xml-anno-edit-text').disabled = false;
								}
								document.getElementById('xml-anno-edit-start-op').disabled = false;
								document.getElementById('xml-anno-edit-timestart').disabled = false;
								document.getElementById('xml-anno-edit-timeend').disabled = false;
								document.getElementById('xml-anno-edit-text').value = annotationnames[anno - 1];
								if (annotationurls[anno - 1]) {
									document.getElementById('xml-anno-edit-link').disabled = false;
									document.getElementById('xml-anno-edit-link-op').disabled = false;
									document.getElementById('xml-anno-edit-link').value = annotationurls[anno - 1];
									if (document.getElementById('xml-anno-edit-link-op').value == '0') {
										document.getElementById('xml-anno-edit-link').disabled = false;
									} else {
										document.getElementById('xml-anno-edit-link').disabled = true;
									}
								} else {
									document.getElementById('xml-anno-edit-link').disabled = true;
									document.getElementById('xml-anno-edit-link-op').disabled = true;
									document.getElementById('xml-anno-edit-link').value = '';
								}
								if (document.getElementById('xml-anno-edit-start-op').value == '1') {
									document.getElementById('xml-anno-edit-custom-time').disabled = false;
								} else {
									document.getElementById('xml-anno-edit-custom-time').value = '0';
									document.getElementById('xml-anno-edit-custom-time').disabled = true;
								}
								document.getElementById('xml-anno-edit-custom-time').value = annotationtimeminus[anno * 2 - 2];
								var ms1 = annotationtimes[anno * 2 - 1]; // your input string
								var a1 = ms1.split(':'); // split it at the colons
								if (a1[2]) {
									if (a1[0] == '00') {
										var annotationtimeend = (+a1[1]) * 60 + (+a1[2]);
										document.getElementById('xml-anno-edit-timeend').value = a1[1] + ':' + a1[2];
									} else {
										var annotationtimeend = (+a1[0]) * 60 + (+a1[1]) * 60 + (+a1[2]);
										document.getElementById('xml-anno-edit-timeend').value = a1[0] + ':' + a1[1] + ':' + a1[2];
									}
								} else {
									var annotationtimeend = (+a1[0]) * 60 + (+a1[1]);
									document.getElementById('xml-anno-edit-timeend').value = a1[0] + ':' + a1[1];
								}
								var ms2 = annotationtimes[anno * 2 - 2]; // your input string
								var a2 = ms2.split(':'); // split it at the colons
								if (a2[2]) {
									if (a2[0] == '00') {
										var annotationtimestart = (+a2[1]) * 60 + (+a2[2]);
										document.getElementById('xml-anno-edit-timestart').value = a2[1] + ':' + a2[2];
									} else {
										var annotationtimestart = (+a2[0]) * 60 + (+a2[1]) * 60 + (+a2[2]);
										document.getElementById('xml-anno-edit-timestart').value = a2[0] + ':' + a2[1] + ':' + a2[2];
									}
								} else {
									var annotationtimestart = (+a2[0]) * 60 + (+a2[1]);
									document.getElementById('xml-anno-edit-timestart').value = a2[0] + ':' + a2[1];
								}
								document.getElementById('xml-anno-edit-time').value = annotationtimeend - annotationtimestart;
							}
						}

						function xml_edit_onselect() {
							var sel = document.getElementById('xml-anno-edit-id');
							sel.onchange = function() {
								xml_edit_display();
							}
							var sel2 = document.getElementById('xml-anno-edit-start-op');
							sel2.onchange = function() {
								if (document.getElementById('xml-anno-edit-start-op').value == '1') {
									document.getElementById('xml-anno-edit-custom-time').disabled = false;

									document.getElementById('xml-anno-edit-timestart').disabled = true;
									document.getElementById('xml-anno-edit-timeend').disabled = true;
								} else {
									document.getElementById('xml-anno-edit-custom-time').value = '0';
									document.getElementById('xml-anno-edit-custom-time').disabled = true;
									document.getElementById('xml-anno-edit-timestart').disabled = false;
									document.getElementById('xml-anno-edit-timeend').disabled = false;
								}
							}
							var sel3 = document.getElementById('xml-anno-edit-link-op');
							sel3.onchange = function() {
								if (document.getElementById('xml-anno-edit-link-op').value == '0') {
									document.getElementById('xml-anno-edit-link').disabled = false;
								} else {
									document.getElementById('xml-anno-edit-link').disabled = true;
								}
							}
						}

						function xmlToString(xmlData) {
							var xmlString;
							//IE
							if (window.ActiveXObject) {
								xmlString = xmlData.xml;
							}
							// code for Mozilla, Firefox, Opera, etc.
							else {
								xmlString = (new XMLSerializer()).serializeToString(xmlData);
							}
							return xmlString;
						}

						//copy youtube annotations
						function copy(data, id, auth_token, num) {
							// insert video_id and auth_token into xml
							data = data.replace(/<requestHeader(.*?)video_id=".*?"(.*?)>/, '<requestHeader$1video_id="' + id + '"$2>');
							data = data.replace(/<authenticationHeader(.*?)auth_token=".*?"(.*?)>/, '<authenticationHeader$1auth_token="' + auth_token + '"$2>');
							var xhr = new XMLHttpRequest();
							xhr.withCredentials = true;
							xhr.open('POST', 'https://www.youtube.com/annotations_auth/update2', true);
							xhr.send(data);
							var logmessage = 'Kopiere ' + num + ' Anmerkungen zu <a href="https://www.youtube.com/my_videos_annotate?v=' + id + '" target="_blank">' + id + '</a>';
							workcounter = parseInt(workcounter) + 1;
							$('#workcounter').text(workcounter.toString());
							cyalog(logmessage);
						};
						//publish youtube annotations
						function publish(id, auth_token) {
							var pubdata = '<document><requestHeader video_id="' + id + '" /><authenticationHeader auth_token="' + auth_token + '" /></document>';
							var xhr = new XMLHttpRequest();
							xhr.withCredentials = true;
							xhr.open('POST', 'https://www.youtube.com/annotations_auth/publish2', true);
							xhr.send(pubdata);
							var logmessage = 'Veröffentliche Anmerkungen für <a href="https://www.youtube.com/my_videos_annotate?v=' + id + '" target="_blank">' + id + '</a>';
							workcounter = parseInt(workcounter) + 1;
							$('#workcounter').text(workcounter.toString());
							cyalog(logmessage);
						};
						//delete youtube annotations
						function deleteannotations(id, auth_token) {
							var video_id = extract_ids(document.getElementById('video_id').value);
							$.ajax({
								url: 'https://www.youtube.com/annotations_invideo?features=1&legacy=1&video_id=' + id,
								type: 'GET',
								dataType: 'html',
								statusCode: {
									404: function() {
										alertmessage('Die eingebene Video(URL) scheint nicht gültig zu sein!');
										var logmessage = 'Anmerkungen konnten nicht abgerufen werden!';
										cyalog(logmessage);
									}
								},
								success: function(response) {
									var data = response;
									data = data.replace(/<\?xml[^>]*\?>/, ''); //https://bugzilla.mozilla.org/show_bug.cgi?id=336551
									data = data.replace(/annotations>/g, 'updatedItems>'); //rename <annotations> to <updatedItems>
									// insert requestHeader and authenticationHeader, if not already present
									var ret = /<authenticationHeader/.exec(data);
									if (ret == null) {
										data = data.replace(/<document.*?>/, '$&<requestHeader video_id="" /><authenticationHeader auth_token="" />');
									}
									// remove InVideo Programming
									data = data.replace(/<annotation [^>]*?id="channel:[\S\s]*?<\/annotation>/g, '');
									// remove EndCard Programming
									data = data.replace(/<annotation [^>]*?id="video:[\S\s]*?<\/annotation>/g, '');

									if (!id) return;
									// extract annotation ids
									var deldata = '<document><requestHeader video_id="' + id + '" /><authenticationHeader auth_token="' + auth_token + '" /><deletedItems>';
									var regex = /<annotation( author=".*?")?( id=".*?")/ig;
									var num = 0;
									while ((ret = regex.exec(data)) != null) {
										num++;
										if (!ret[1]) ret[1] = ' author=""'; // author is only included when fetching annotations from old videos and using the annotation editor (but author must be present when deleting, so guessing empty author, which won't work if the annotation is super old; in this case, fetch the annotations via the annotation editor by using the greasemonkey script)
										deldata += '<deletedItem' + ret[1] + ret[2] + ' />';
									}
									deldata += '</deletedItems></document>';
									var xhr = new XMLHttpRequest();
									xhr.withCredentials = true;
									xhr.open('POST', 'https://www.youtube.com/annotations_auth/update2', true);
									xhr.send(deldata);
									var logmessage = 'Lösche ' + num + ' Anmerkungen von <a href="https://www.youtube.com/my_videos_annotate?v=' + id + '" target="_blank">' + id + '</a>';
									cyalog(logmessage);
									// publish in a moment
									setTimeout(function() {
										var pubdata = '<document><requestHeader video_id="' + id + '" /><authenticationHeader auth_token="' + auth_token + '" /></document>';
										var xhr = new XMLHttpRequest();
										xhr.withCredentials = true;
										xhr.open('POST', 'https://www.youtube.com/annotations_auth/publish2', true);
										xhr.send(pubdata);
										var logmessage = 'Veröffentliche Anmerkungen für <a href="https://www.youtube.com/my_videos_annotate?v=' + id + '" target="_blank">' + id + '</a>';
										workcounter = parseInt(workcounter) + 1;
										$('#workcounter').text(workcounter.toString());
										cyalog(logmessage);
									}, 1000);
								}
							});
						};



						function deleteannotationsq(id, auth_token) {
							var video_id = extract_ids(document.getElementById('video_id').value);
							$.ajax({
								url: 'https://www.youtube.com/annotations_invideo?features=1&legacy=1&video_id=' + id,
								type: 'GET',
								dataType: 'html',
								statusCode: {
									404: function() {
										alertmessage('Die eingebene Video(URL) scheint nicht gültig zu sein!');
										var logmessage = 'Anmerkungen konnten nicht abgerufen werden!';
										cyalog(logmessage);
									}
								},
								success: function(response) {
									var data = response;
									data = data.replace(/<\?xml[^>]*\?>/, ''); //https://bugzilla.mozilla.org/show_bug.cgi?id=336551
									data = data.replace(/annotations>/g, 'updatedItems>'); //rename <annotations> to <updatedItems>
									// insert requestHeader and authenticationHeader, if not already present
									var ret = /<authenticationHeader/.exec(data);
									if (ret == null) {
										data = data.replace(/<document.*?>/, '$&<requestHeader video_id="" /><authenticationHeader auth_token="" />');
									}
									// remove InVideo Programming
									data = data.replace(/<annotation [^>]*?id="channel:[\S\s]*?<\/annotation>/g, '');
									// remove EndCard Programming
									data = data.replace(/<annotation [^>]*?id="video:[\S\s]*?<\/annotation>/g, '');

									if (!id) return;
									// extract annotation ids
									var deldata = '<document><requestHeader video_id="' + id + '" /><authenticationHeader auth_token="' + auth_token + '" /><deletedItems>';
									var regex = /<annotation( author=".*?")?( id=".*?")/ig;
									var num = 0;
									while ((ret = regex.exec(data)) != null) {
										num++;
										if (!ret[1]) ret[1] = ' author=""'; // author is only included when fetching annotations from old videos and using the annotation editor (but author must be present when deleting, so guessing empty author, which won't work if the annotation is super old; in this case, fetch the annotations via the annotation editor by using the greasemonkey script)
										deldata += '<deletedItem' + ret[1] + ret[2] + ' />';
									}
									deldata += '</deletedItems></document>';
									var xhr = new XMLHttpRequest();
									xhr.withCredentials = true;
									xhr.open('POST', 'https://www.youtube.com/annotations_auth/update2', true);
									xhr.send(deldata);
									// publish in a moment
									setTimeout(function() {
										var pubdata = '<document><requestHeader video_id="' + id + '" /><authenticationHeader auth_token="' + auth_token + '" /></document>';
										var xhr = new XMLHttpRequest();
										xhr.withCredentials = true;
										xhr.open('POST', 'https://www.youtube.com/annotations_auth/publish2', true);
										xhr.send(pubdata);
									}, 1000);
								}
							});
							deleteannotations(id, auth_token);
						};

						function multilineTrim(htmlString) {
							return htmlString.split("\n").map($.trim).filter(function(line) {
								return line != ""
							}).join("\n");
						}
						xml_edit_onselect();
						startup();
					}
				} else {
					alertmessage('Oops! Something went wrong!');
				}
			}
		}
	});
};

if ( $('#tool-information').length ) {
	start();
}