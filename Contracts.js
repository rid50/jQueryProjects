$(document).ready(function () {
    MyGrid.Contracts.setupGrid($("#grid"), $("#pager"), $("#search"));
});

MyGrid.Contracts = {
    setupGrid: function (grid, pager, search) {
        //        debugger; 
        grid.jqGrid({
            url: "Contracts/List",
            mtype: "get",
            datatype: "json",
            colNames: ['Contract Id', 'Contract Name', 'Date Entry', 'Contr. Value', ''],
            colModel: [             //http://php.net/manual/en/function.date.php
                        {name: 'ContractId', index: 'contract_id', width: '50', align: 'left', sortable: true, hidden: false },
                        { name: 'ContractName', index: 'contract_name', align: 'left', sortable: true, hidden: false, editable: true },
            //{ name: 'DateEntry', index: 'DateEntry', align: 'left', sortable: true, hidden: false, sorttype: 'date', formatter: 'date', formatoptions: { srcformat: 'M j Y h:i A', newformat: 'd-M-Y h:iA'} },  //DateEntry = "Dec 31 1999 12:00AM"
                        {name: 'DateEntry', index: 'date_entry', align: 'center', width: '40px', sortable: true, hidden: false, sorttype: 'date', formatter: 'date', formatoptions: { srcformat: 'm d Y g:i:s', newformat: 'd-M-Y'} }, //DateEntry (src) = "12/31/1999 00:00:00"
                        {name: 'ContractValue', index: 'contract_value', align: 'right', width: '45', sortable: false, hidden: false, editable: true },
                        { name: 'Currency', index: 'currency', align: 'left', width: '15', sortable: false, hidden: false, editable: false },
                      ],
            rowNum: 10,
            rowList: [10, 20],
            pager: pager,
            sortname: 'contract_id',
            sortorder: "asc",
            viewrecords: true,
            multiselect: false,
            editurl: "Contracts/Edit",
            width: '100%',
            height: '100%',
            /*rowheight: '30px',*/
            shrinkToFit: true,
            autowidth: true,
            rownumbers: true,
            caption: 'Contracts',
            toppager: false,
            loadError: function (xhr, st, err) {
                if (window.console) window.console.log('failed');
                $('#alertContent').html("Type: " + st + "; Response: " + xhr.status + " " + xhr.statusText);
                //$('#alertContent').html(xhr.responseText);
                $('#alert').dialog('open');
                //$('#info').text(event.toString()).css({ 'color': 'orange', 'fontweight': 'bold' });
            },
            loadComplete: function (event) {
                //debugger;
                jQuery('#grid_d').setGridParam({ url: "ContractDetails/List?contract_id=0", page: 1 }).trigger('reloadGrid');
                //$('.ui-pg-table').css({ 'width': '600px', 'width': 'auto', 'table-layout': 'auto', 'border': '0px solid green' });
                //$('#pager_center').css({ 'width': '500px', 'border': '0px solid red' });
                //$('#pager_d_center').css({ 'width': '500px', 'border': '0px solid red' });

                $('#formContract .submit').attr('disabled', 'disabled');
                $('#formContract')[0].reset();
                //$('#formContract').fadeOut(500);

                //jQuery('#grid_d').trigger("reloadGrid");
                //grid.jqGrid('setSelection', "1");
            },
            onSelectRow: function (ids) {
                //grid.jqGrid('setSelection', "1");
                //debugger;
                $('#formContract .submit').removeAttr("disabled");
                $('#formContract').fadeIn(500, 'linear', function () {
                    var v = $('#grid').getCell(ids, 'ContractId');
                    $('#contract_id').val($('#grid').getCell(ids, 'ContractId'));
                    $('#contract_name').val($('#grid').getCell(ids, 'ContractName'));
                    //var dt = $.format.date($('#grid').getCell(ids, 'DateEntry'), "dd/MM/yyyy");
                    //var dt = $.datepicker.formatDate('dd/mm/yy', new Date(2007, 1 - 1, 26));
                    var dtString = $('#grid').getCell(ids, 'DateEntry');
                    var dtDate = $.datepicker.parseDate('dd-M-yy', dtString);   //Dec 31 1999
                    dtString = $.datepicker.formatDate('dd/mm/yy', dtDate);     //31/12/1999
                    $('#date_entry').val(dtString);
                    //var v = $('#grid').getCell(ids, 'ContractValue');
                    //v = v.substring(0, v.indexOf(' '));
                    $('#contract_value').val($('#grid').getCell(ids, 'ContractValue'));
                    //$('#info').text(v);
                    //alert(v);
                });
                if (ids == null) {
                    ids = 0;
                    if (jQuery('#grid_d').getGridParam('records') > 0) {
                        jQuery('#grid_d').setGridParam({ url: "ContractDetails/List?contract_id=" + ids, page: 1 }).setCaption("Contract: " + ids).trigger('reloadGrid');
                    }
                } else {
                    //debugger;
                    //var rowData = grid.getRowData(ids);
                    //var contractId = rowData['ContractId'];
                    var contractId = $('#grid').getCell(ids, 'ContractId');
                    jQuery('#grid_d').setGridParam({ url: "ContractDetails/List?contract_id=" + contractId, page: 1 }).setCaption("Contract: " + contractId).trigger('reloadGrid');
                }
            }
            //        }).jqGrid('navGrid', pager, { edit: true, add: false, del: false, search: false, refresh: true });
        }).navGrid("#pager", { view: false, edit: true, add: true, del: true, search: false, refresh: true },
                                {}, // settings for edit
                                {}, // settings for add
                                {}, // settings for delete
                                {sopt: ["cn"]} // Search options. Some options can be set on column level        
                  );
        search.filterGrid("#" + grid.attr("id"), {
            gridModel: false,
            filterModel: [{
                label: 'Search',
                name: 'search',
                stype: 'text'
            }]
        });

    }
};

$(document).ready(function () {
	MyGrid.ContractDetails.setupGrid($("#grid_d"), $("#pager_d"), $("#search_d"));
});

MyGrid.ContractDetails = {
	setupGrid: function (grid, pager, search) {
		grid.jqGrid({
			//url: "ContractDetails/List?contract_id=AA/SCB/25/8/99",
			url: "ContractDetails/List",
			mtype: "get",
			datatype: "json",
			colNames: ['Supplier Id', 'Item Id', 'Part No', 'Unit Price', 'Cost Price', 'Currency'],
			colModel: [
				//{ name: 'ContractId', index: 'contract_id', width: 50, align: 'left', sortable: true, hidden: false },
				{ name: 'SupplierId', index: 'supplier_id', width: '70', sortable: true, hidden: false },
				{ name: 'ItemId', index: 'item_id', width: '35', align: 'right', sortable: true, hidden: false },
				{ name: 'PartNo', index: 'part_no', sortable: true, hidden: false },
				{ name: 'UnitPrice', index: 'unit_price', align: 'right', width: '50', sortable: true, hidden: false },
				{ name: 'CostPrice', index: 'cost_price', align: 'right', width: '50', sortable: true, hidden: false },
				{ name: 'Currency', index: 'currency', align: 'right', width: '40', sortable: true, hidden: false }
			  ],
			rowNum: 10,
			rowList: [10, 20],
			pager: pager,
			sortname: 'supplier_id, item_id',
			sortorder: "asc",
			viewrecords: true,
			multiselect: false,
			editurl: "ContractDetails/Edit",
			width: '100%',
			height: '100%',
			shrinkToFit: true,
			autowidth: true,
			rownumbers: true,
			caption: 'Contract Details',
			loadError: function (xhr, st, err) {
				if (window.console) window.console.log('failed');
				$('#alertContent').html("Type: " + st + "; Response: " + xhr.status + " " + xhr.statusText);
				//$('#alertContent').html(xhr.responseText);
				$('#alert').dialog('open');
				//$('#info').text(event.toString()).css({ 'color': 'orange', 'fontweight': 'bold' });
			}
		}).navGrid("#pager_d", { edit: true, add: true, del: true, search: false });
		search.filterGrid("#" + grid.attr("id"), {
			gridModel: false,
			filterModel: [{
				label: 'Search',
				name: 'search_d',
				stype: 'text'
			}]
		});
	}
};

var timeoutHnd;
var flAuto = false;
function doSearch(ev) {
	if (ev.keyCode == 13) {
		timeoutHnd = setTimeout(gridReload, 500);
		return;
	}
	if (!flAuto) return;
	// var elem = ev.target||ev.srcElement;
	if (timeoutHnd) {
		clearTimeout(timeoutHnd)
	}
	if ((ev.keyCode >= 65 && ev.keyCode <= 90) || ev.keyCode == 8 || ev.keyCode == 46 || (ev.keyCode >= 48 && ev.keyCode <= 57) || (ev.keyCode >= 96 && ev.keyCode <= 105)) {
		timeoutHnd = setTimeout(gridReload, 500)
	}
}
function gridReload() {
	var search = $('#item').val();
	jQuery("#grid").setGridParam({ url: "Contracts/List?search=" + search, page: 1 }).trigger("reloadGrid");
}

function enableAutosubmit(state) {
	flAuto = state;
	jQuery("#submitButton").attr("disabled", state);
} 