/**
 * Copyright 2019 ISTAT
 * 
 * Licensed under the EUPL, Version 1.1 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence. You may
 * obtain a copy of the Licence at:
 * 
 * http://ec.europa.eu/idabc/eupl5
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * Licence for the specific language governing permissions and limitations under
 * the Licence.
 * 
 * @author Francesco Amato <framato @ istat.it>
 * @author Mauro Bruno <mbruno @ istat.it>
 * @author Paolo Francescangeli <pafrance @ istat.it>
 * @author Renzo Iannacone <iannacone @ istat.it>
 * @author Stefano Macone <macone @ istat.it>
 * @version 1.0
 */
var _ctx = $("meta[name='ctx']").attr("content");
var toggle = true;

$(document).ready(function () {
 
    $("#contenuto_file").hide();
    showPanel('variabili');
    
    $('form input').on('keypress', function(e) {
        return e.which !== 13;
    });

    
    $('#add-param > input').on("change paste keyup", function() {
    	   alert($(this).val()); 
    });
    
    $('#edit-param > input').on("change paste keyup", function() {
 	   alert($(this).val()); 
    });
    
    $("#worksetTabList").DataTable({
        dom: "<'row'<'col-sm-5'B><'col-sm-7'f>>"
                + "<'row'<'col-sm-12'tr>>"
                + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        scrollX: true,
        paging: false,
        ordering: false,
        buttons: [{
                className: 'btn-extenal-function btn-light',
                text: '<i class="fa fa-plus"></i><span> Variabile</span>',
                action: function (e, dt, node, config) {
                    openDlgAddVariabileWorkset();
                }
            }],
        createdRow: function (row, data, dataIndex) {
            $(row).attr('id', 'row-' + dataIndex);
        }
    });


    var listVarSize = $("#check_vrs").val();
    if (listVarSize == 0) {
        $("#processiList").find("a[name='link']").addClass("disabled");
    }

    $('#btn_delete').click(function () {
        var idelab = $("#idelab").val();
        var idstepvar = $("#idstepvar").val();
        window.location = _ctx
                + '/ws/eliminaAssociazione/' + idelab
                + "/" + idstepvar;
    });

    $('#btn_delete_param').click(function () {
        var idelab = $("#idelab").val();
        var idparam = $("#idparam").val();
        window.location = _ctx
                + '/ws/eliminaParametro/' + idelab
                + "/" + idparam;
    });

    $("#parametriTabList").DataTable({
        dom: "<'row'<'col-sm-6'B><'col-sm-6'f>>"
                + "<'row'<'col-sm-12'tr>>"
                + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        paging: false,
        ordering: false,
        buttons: [{
                className: 'btn-extenal-function btn-light',
                text: '<i class="fa fa-plus"></i><span> Parametro</span>',
                action: function (e, dt, node, config) {
                    openDlgAddParametriWorkset();
                }
            }],
        createdRow: function (row, data, dataIndex) {
            $(row).attr('id', 'row-' + dataIndex);
        }
    });

 
    var idElaborazione = 1; // _idElaborazione;

    $("#worksetTab").DataTable({
        drawCallback: function () {
            $(".loading").hide();
        },
        dom: "<'row'<'col-sm-4'B><'col-sm-4'f><'col-sm-4'<'pull-right'l>> >"
                + "<'row'<'col-sm-12'tr>>"
                + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        responsive: true,
        ordering: false,
        searching: false,
        lengthChange: true,
        pageLength: 25,
        serverSide: true,
        ajax: _ctx + "/rest/ws/worksetvalori/" + idElaborazione,
        columns: eval(getHeaders('worksetTab')),
        processing: true,
        buttons: [{
                extend: 'csvHtml5',
                filename: 'download',
                title: 'download',
                action: function (e, dt, node, config) {
                    scaricaFile('csv');
                }
            }]
    });

    $("#nome-var").on("input", function () {
        controllaCampo();
    });

    $('#value-text').on("keyup", function (e) {
        controllaCampoParam();
    });

    $('#value-text-mod').on("keyup", function (e) {
        controllaCampoModParam();
    });
    
         

});

function openAddParameter(identifier) {
   var idParam=$(identifier).data('param-id');
	var idRole=$(identifier).data('role-id');
	var nameParameter=$(identifier).data('param-name');
	$('#param-text-add').text(nameParameter);
	$('#param-value').val(nameParameter+'|'+idParam+'|'+idRole);
	var jsontemplateText=_paramTemplateMap[nameParameter];
	var jsontemplate=JSON.parse(jsontemplateText);
	var schema=jsontemplate["schema"];
	var options=jsontemplate["options"];
	var dataContent="{\"schema\":"+JSON.stringify(schema)+",\"options\":"+JSON.stringify(options)+"}";
	$('#add-param').empty();
	$('#add-param').alpaca(JSON.parse(jsontemplateText)); 
	$("#add-parametri-workset-modal").modal('show');
}


function associaVar() {
	 var varSelectedId = $("#varSelectedId").val();
	 var varSelectedName = $("#varSelectedName").val();
    var labelFile = $("#varLabelFile").val();
    var roleSelectedName = $("#roleSelectedName").val();
    var roleSelectedId = $("#roleSelectedId").val();
    var labelFileSet = labelFile;
	 var idTab = "" + varSelectedId;
    var li = $( tabTemplate.replace( /#\{href\}/g, "#" + idTab ).replace( /#\{label\}/g, labelFileSet + '-' + varSelectedName) );
    var tabContentHtml = roleSelectedName;
    tabs.find( ".ui-tabs-nav" ).append( li );
  	 tabs.append( "<div id='" + varSelectedId + "'><p>" + tabContentHtml + "</p></div>" );
  	 tabs.tabs( "refresh" );
    tmpVarSel['#var_'+varSelectedId]  =  $('#var_'+varSelectedId).clone();
  	$('#var_'+varSelectedId).remove();
  	$("#btn_dlg_ins").removeClass('hide');
  	$("#role_"+roleSelectedId).removeClass('active');
  	$("#varSelectedId").val("");
  	$("#roleSelectedId").val("");
  	$('#btn_dlg_assoc').addClass('disabled');
  	$('#btn_dlg_assoc').attr( "disabled","disabled");
  	associazioneVarRoleBean.push({'idElaborazione':$("#idelaborazione").val(),'ruolo':{'idRole':roleSelectedId,'name':roleSelectedName,'variables':[{'idVar':varSelectedId,'name':varSelectedName}]}});
   console.log(JSON.stringify(associazioneVarRoleBean));
 }
       
 function removeSelVarFromTab(id){
	tmpVarSel['#var_'+id].prependTo("#div_variabili_dataset");
	$('#var_'+id).removeClass('active');
	delete tmpVarSel['#var_'+id];
	delete associazioneVarRoleBean[id];
	if(Object.entries(tmpVarSel).length === 0 && tmpVarSel.constructor === Object){
		$("#btn_dlg_ins").addClass('hide');
	}
	const index = associazioneVarRoleBean.findIndex(x => x.idVar === id);
	if (index !== undefined) associazioneVarRoleBean.splice(index, 1);
	console.log(JSON.stringify(associazioneVarRoleBean));
 }
 
 function associaVarToRole(){
	    var id_elaborazione = $("#idelaborazione").val();
	 	var myUrl = $("meta[name='ctx']").attr("content") + "/rest/ws/associaVariabiliRuolo";
  	 $.ajax({
  		url: myUrl,
  		headers : {
           'Accept' : 'application/json',
           'Content-Type' : 'application/json'
       },
       type: "POST",
       async:false,
  	    data : JSON.stringify(associazioneVarRoleBean),
  	    success: function () {
			console.log("success! ");
			window.location.href = $("meta[name='ctx']").attr("content") + "/ws/editworkingset/"+ id_elaborazione;
       },
       error: function (jqXHR, textStatus, errorThrown) {
           console.log('Error!', errorThrown);
       }
  	});
 }

function openDlgModParametriWorkset(identifier) {
		// controllaCampoModParam();
 	var idParam=$(identifier).data('id-param');
	var idWorkset=$(identifier).data('id-workset');
	var nameParameter=$(identifier).data('name-workset');
	$('#param-text-edit').text(nameParameter);
	var jsontemplateText=_paramTemplateMap[nameParameter];
    var jsontemplate=JSON.parse(jsontemplateText);
     var schema=jsontemplate["schema"];
     var options=jsontemplate["options"];
     if(!options) options="";
     var data=$(identifier).data('value-param');
     if(!data) data="";
    $('#edit-parameters').val(idWorkset);
     var dataContent="{\"data\":"+ JSON.stringify(data)+",\"schema\":"+JSON.stringify(schema)+",\"options\":"+JSON.stringify(options)+"}";
      $('#edit-param').empty();
     $('#edit-param').alpaca(JSON.parse(dataContent));
     $("#idStepvarMod").val(idParam);
  $("#mod-parametri-workset-modal").modal("show");
}

function mostraDialogEliminaParametro(identifier) {
	var idParam=$(identifier).data('id-param');
	var idelab=$(identifier).data('id-elab');
	var nameParam=$(identifier).data('name-param');
	
    $("#idparam").val(idParam);
    $("#idelab").val(idelab);
    $("#nomeParametro").text(nameParam);
   
    $("#modal-cancella-parametro").modal("show");
}


function cambiaPosizione() {
    var ordineIds = "";
    var ids = $("#worksetTabList").find(
            "input[name='stepid']");
    for (var i = 0; i < ids.length; i++) {
        ordineIds += i + "=" + ids[i].value + "|";
    }
    ordineIds = ordineIds.slice(0, -1);
    updateOrdineRighe(ordineIds);
}

function updateOrdineRighe(ordineIds) {
    $.ajax({
        url: _ctx + "/rest/ws/updaterowlist",
        type: "POST",
        data: "ordineIds=" + ordineIds,
        success: function (data) {
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error loading data');
        }
    });
}
function isNumber(o) {
    return o == '' || !isNaN(o - 0);
}
function controllaInputText() {
    if ($("#nome-var").val().length > 0) {
        $("#btn_dlg_assoc_mod").removeClass('disabled');
        $("#btn_dlg_assoc_mod").removeAttr('disabled');
    }
}
function attivaBottone() {
    var contenuto = $("#vars_content").text();
    $("#btn_rimuovi_ass").show();
    if (contenuto == "") {
        $("#btn_rimuovi_ass").hide();
    }
}
function getHeaders(tab) {
    var text = '[';
    $("#" + tab + " th").map(function () {
        text += '{"data": "' + $(this).text() + '"},';
    });
    if (text.length > 1)
        text = text.substring(0, text.length - 1);
    text += ']';
    return text;
}

function openDlgAddVariabileWorkset() {
    $(".rolelist").removeClass('active');
    $(".varlist").removeClass('active');
    $("#varSelectedId").val('');
    $("#varSelectedName").val('Nessuna variabile selezionata');
    $("#roleSelectedId").val('');
    $("#roleSelectedName").val('Nessun ruolo selezionato');
    $("#btn_dlg_assoc").addClass('disabled');
    $("#btn_dlg_assoc").attr("disabled", "disabled");
    $("#add-viarabile-workset-modal").modal('show');
}

function openDlgAddParametriWorkset() {
 // controllaCampoParam();
   
    $(".rolelist").removeClass('active');
    $(".varlist").removeClass('active');
    $("#varSelectedId").val('');
    $("#varSelectedName").val('Nessuna variabile selezionata');
    $("#roleSelectedId").val('');
    $("#roleSelectedName").val('Nessun ruolo selezionato');
    $("#add-parametri-workset-modal").modal('show');
    $("#select-param").change();
    
}


function controllaCampoModParam() {
    if ($("#value-text-mod") && $("#value-text-mod").val().length > 0) {
        $("#btn_dlg_mod_assoc_param").removeClass('disabled');
        $("#btn_dlg_mod_assoc_param").removeAttr('disabled');
    } else {
        $("#btn_dlg_mod_assoc_param").addClass('disabled');
        $("#btn_dlg_mod_assoc_param").attr("disabled", "disabled");
    }
}

function setSelectedVar(ordine, nome, id, labelFile) {
    $(".varlist").removeClass('active');
    $("#var_" + id).addClass('active');
    $("#varSelectedId").val(id);
    $("#varSelectedName").val(nome);
    $("#varLabelFile").val(labelFile);
    if ($("#varSelectedId").val().length > 0 && $("#roleSelectedId").val().length > 0) {
        $("#btn_dlg_assoc").removeClass('disabled');
        $("#btn_dlg_assoc").attr("disabled", false);
    }
}

function setSelectedVarMod(ordine, nome, id) {
    $(".varlist").removeClass('active');
    $("#mod_var_" + id).addClass('active');
    $("#varModSelectedId").val(id);
    $("#varModSelectedName").text(nome);
    if ($("#varModSelectedId").val().length > 0 || $("#roleModSelectedId").val().length > 0) {
        $("#btn_dlg_assoc_mod").removeClass('disabled');
        $("#btn_dlg_assoc_mod").attr("disabled", false);
    }
}

function setSelectedRole(nomeR, idR) {
    $(".rolelist").removeClass('active');
    $("#role_" + idR).addClass('active');
    $("#roleSelectedId").val(idR);
    $("#roleSelectedName").val(nomeR);
    if ($("#varSelectedId").val().length > 0 && $("#roleSelectedId").val().length > 0) {
        $("#btn_dlg_assoc").removeClass('disabled');
        $("#btn_dlg_assoc").attr("disabled", false);
    }
}

function setModSelectedRole(nomeR, idR) {
    $("#mod_idruolo").val(idR);
    $(".rolelist").removeClass('active');
    $("#mod_role_" + idR).addClass('active');
    $("#roleModSelectedId").val(idR);
    $("#roleModSelectedName").text(nomeR);
    if ($("#varModSelectedId").val().length > 0 || $("#roleModSelectedId").val().length > 0)
        $("#btn_dlg_assoc_mod").removeClass('disabled');
}

function inserisciRuoloVar() {
    var var_id = $("#varSelectedId").val();
    var var_nome = $("#varSelectedName").val();
    var role_id = $("#roleSelectedId").val();
    var role_nome = $("#roleSelectedName").val();
    var id_elaborazione = $("#idelaborazione").val();
    var content = $("#vars_content").html();
    var input_content = $("#associazione_vars").html();

    input_content += "<input type='hidden' name='ruolo' value='" + role_id
            + "'/><input type='hidden' name='variabile' value='" + var_id
            + "'/>" + "<input type='hidden' name='valore' value='" + var_nome
            + "'/>" + "<input type='hidden' name='elaborazione' value='"
            + id_elaborazione
            + "'/></span><input type='hidden' name='stato' value='N'/></span>";

    $("#associazione_vars").html(input_content);
    $("#vars_content").html(content);
    eseguiFunzione();
}
function modificaRuoloVar() {
    var var_id = $("#varModSelectedId").val();
    var var_nome = $("#varModSelectedName").text();
    var role_id = $("#roleModSelectedId").val();
    var role_nome = $("#roleModSelectedName").text();
    var id_elaborazione = $("#idelaborazione").val();
    var input_content = $("#update_associazione_vars").html();
    input_content += "<input type='hidden' name='elaborazione' value='" + id_elaborazione
            + "'/></span><input type='hidden' name='stato' value='N'/></span>";

    $("#update_associazione_vars").html(input_content);
    eseguiFunzioneUpdate();
}

function eliminaRiga(id) {
    var table = $('#worksetTabList').DataTable();
    table.row('#row-' + id).remove().draw();
}

function openSceltaRuolo(ordine, nome, id) {
    $("#temp_var").val(id);
    $("#variabile").text(nome);
    $("#scelta-ruolo-modal").modal('show');
}

function associaRuoloVar(nomeR, idR) {
    var var_val = $("#temp_var").val();
    var name_var = $("#variabile").text();
    var id_elaborazione = $("#idelaborazione").val();
    $("#vars_content").html();
    $("#ruolo").val(idR);
    var content = $("#vars_content").html();
    var input_content = $("#associazione_vars").html();
    // aggiungo una riga alla tabella con la variabile corrispondente
    if ($("#tab_associated tr.input_" + idR).length == 0) {

        $('#tab_associated > tbody:last-child').append(
                '<tr class="input_'
                + idR
                + '"><td>'
                + nomeR
                + '</td><td></td><td><input id="input_'
                + idR
                + '" type="text" data-role="tagsinput"></input></td></tr>');
        $('#input_' + idR).tagsinput();
        // Intercetta il remove e rimuove anche la variabile input associata
        $('#input_' + idR).on('itemRemoved', function (event) {
            rimuoviInputVarAssociata(idR, var_val);
            if ($('#input_' + idR).val().trim().length == 0)
                $(this).closest("tr").remove();
        });
    }
    $('#input_' + idR).tagsinput('add', name_var);

    // Se la variabile input esiste già non la crea ma aggiunge solo il
    // contenuto altrimenti la crea
    if ($("#span_" + idR + "_" + var_val + "").length == 0) {
        // aggiungo un input text per la variabile
        input_content += "<span id='span_" + idR + "_" + var_val
                + "'><input type='hidden' name='ruolo' value='" + idR
                + "'/><input type='hidden' name='variabile' value='" + var_val
                + "'/>" + "<input type='hidden' name='elaborazione' value='"
                + id_elaborazione + "'/></span>";
        $("#associazione_vars").html(input_content);
    } else {
        // Se l'id esiste già aggiungo semplicemente il contenuto
        var input_var = "<input type='hidden' name='ruolo' value='" + idR
                + "'/><input type='hidden' name='variabile' value='" + var_val
                + "'/>" + "<input type='hidden' name='elaborazione' value='"
                + id_elaborazione + "'/></span>";
        $("#span_" + idR + "_" + var_val + "").html(input_var);
    }

    $("#vars_content").html(content);
    $("#scelta-ruolo-modal").modal("hide");

}
function rimuoviInputVarAssociata(idr, idvar) {
    $("#span_" + idr + "_" + idvar + "").html("");
}
function caricaBProcessiByFunzione() {
    var id_funzione = $("#funzioni :selected").val();
    $.ajax({
        url: _ctx + "/rest/ws/loadBProcess/" + id_funzione,
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            var content = "<div class='col-lg-4'><label class='control-label'>"
                    + "<span id='process'>Business Process:</span></label></div><div class='col-lg-8'>"
                    + "<select id='processi' name='processo' class='form-control'>";
            $(jQuery.parseJSON(JSON.stringify(data))).each(
                    function () {
                        var id = this.id;
                        var descr = this.descr;
                        content += "<option value='" + id + "'>" + descr + "</option>";
                    });
            content += "</select></div>";
            $("#bprocess").html(content);
            // carico direttamente la combo bsteps
            caricaBStepsByProcess();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error loading data');
        }
    });
}
function caricaBStepsByProcess() {
    var id_process = $("#processi :selected").val();
    $.ajax({
        url: _ctx + "/rest/ws/loadBSteps/" + id_process,
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            var content = "<div class='col-lg-4'><label class='control-label'>"
                    + "<span id='step'>Business Steps:</span></label></div><div class='col-lg-8'>"
                    + "<select id='sel_step' name='step' class='form-control'>";
            $(jQuery.parseJSON(JSON.stringify(data))).each(function () {
                var id = this.id;
                var descr = this.descr;
                content += "<option value='" + id + "'>"
                        + descr + "</option>";
            });
            content += "</select></div>";
            $("#bstep").html(content);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error loading data');
        }
    });
}
function visualizzaVariabiliAssociate() {
    var id_process = $("#processi :selected").val();
    $.ajax({
        url: _ctx + "/rest/ws/loadBSteps/" + id_process,
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            var content = "<div class='col-lg-4'><label class='control-label'>"
                    + "<span id='step'>Business Steps:</span></label></div><div class='col-lg-8'>"
                    + "<select id='sel_step' name='step' class='form-control'>";
            $(jQuery.parseJSON(JSON.stringify(data))).each(function () {
                var id = this.id;
                var descr = this.descr;
                content += "<option value='" + id + "'>"
                        + descr + "</option>";
            });
            content += "</select></div>";
            $("#bstep").html(content);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error loading data');
        }
    });
}
function eliminaAssociazioni() {
    $("#vars_content").html("");
    $("#associazione_vars").html("");
    attivaBottone();
}
function eseguiFunzione() {
    $("#formAssociaRuolo").submit();
}
function eseguiFunzioneUpdate() {
    $("#formUpdateAssociaRuolo").submit();
}

function inserisciParams() {
	var value =  JSON.stringify($('#add-param').alpaca().getValue());
	
    $("#valoreParam").val(value);
    $("#formAssociaParam").submit();
}

function modificaParam() {
	var value =  JSON.stringify($('#edit-param').alpaca().getValue());
    $("#valoreParamMod").val(value);
   $("#formModAssociaParam").submit();
}

function mostraDialogEliminaAssociazione(idelab, idstepvar, nomestepvar) {
    $("#nomeStepVar").text(nomestepvar);
    $("#idelab").val(idelab);
    $("#idstepvar").val(idstepvar);
    $("#modalCancellaAssociazione").modal("show");
}


function test() {
    alert($("#nome-var").val().length);
    ($("#filtro1").prop("checked") != false || $("#filtro0").prop("checked") != false)
            && $("#nome-var").val().length > 0
}

function mostraDialogModificaAssociazioneOld(idelab, idstepvar, nomestepvar,
        idruolo, flagricerca) {
    $("#mod_idruolo").val(idruolo);
    $("#mod_idvariabile").val(idstepvar);
    $("#mod_nomevariabile").val(nomestepvar);
    $(".rolelist").removeClass('active');
    $(".varlist").removeClass('active');
    $("#mod_var_" + idstepvar).addClass('active');
    $("#mod_role_" + idruolo).addClass('active');
    $("#varModSelectedId").val('');
    $("#varModSelectedName").text('Nessuna variabile selezionata');
    $("#roleModSelectedId").val('');
    $("#roleModSelectedName").text('Nessun ruolo selezionato');
    $("#btn_dlg_assoc_mod").addClass('disabled');
    $("#btn_dlg_assoc_mod").attr("disabled", "disabled");
    $("#modifica-viarabile-workset-modal").modal('show');
}
function controllaCampo() {
    if (($("#filtro1").is(':checked') == true || $("#filtro0").is(':checked') == true)
            && $("#nome-var").val().length > 0) {
        $("#btn_dlg_assoc_mod").removeClass('disabled');
        $("#btn_dlg_assoc_mod").removeAttr('disabled');
    } else {

        $("#btn_dlg_assoc_mod").addClass('disabled');
        $("#btn_dlg_assoc_mod").attr("disabled", "disabled");
    }

}

function controllaCampoParam() {
    if ($("#value-text").val() && $("#value-text").val().length > 0 && $("#value-text").val() != '') {
        $("#btn_dlg_assoc_param").removeClass('disabled');
        $("#btn_dlg_assoc_param").removeAttr('disabled');
    } else {
        $("#btn_dlg_assoc_param").addClass('disabled');
        $("#btn_dlg_assoc_param").attr("disabled", "disabled");
    }
}

function mostraDialogModificaAssociazione(idelab, idstepvar, nomestepvar, idruolo, flagricerca) {

    $("#nome-var").val(nomestepvar);
    if (($("#filtro1").is(':checked') == true || $("#filtro0").is(':checked') == true) && $("#nome-var").val().length > 0) {
        $("#btn_dlg_assoc_mod").removeClass('disabled');
        $("#btn_dlg_assoc_mod").removeAttr('disabled');
    } else {
        $("#btn_dlg_assoc_mod").addClass('disabled');
        $("#btn_dlg_assoc_mod").attr("disabled", "disabled");
    }

    $("#idruolomod").val(idruolo).change();
    if (flagricerca != 'null') {
        $("#filtro" + flagricerca).attr("checked", "checked");
    } else {
        $("#filtro0").attr("checked", "checked");
    }

    controllaCampo();

    $("filtro:checked").val(idruolo);
    $("#mod_idvariabile").val(idstepvar);
    $("#mod_valore_old").val(nomestepvar);
    $("#mod_nomevariabile").val(nomestepvar);
    $("#varModSelectedId").val('');
    $("#varModSelectedName").text('Nessuna variabile selezionata');
    $("#roleModSelectedId").val('');
    $("#roleModSelectedName").text('Nessun ruolo selezionato');
    $("#modifica-viarabile-workset-modal").modal('show');
}

function showPanel(idPanel){
    hidePanels();
    $("#card-" + idPanel).show();
    $("#header-" + idPanel +" span").addClass("header-strong");
}

function hidePanels(){
    $("#card-variabili").hide();
    $("#header-variabili span").removeClass("header-strong");
    $("#card-parametri").hide();
    $("#header-parametri span").removeClass("header-strong");
    $("#card-execution").hide();
    $("#header-execution span").removeClass("header-strong");
}