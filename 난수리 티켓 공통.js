
//기술지원 난수리 티켓 공통 자바스크립트

$(document).ready(function(){
	techUtil.setStartDate("stdd","365");
	//초기화
	hrTicketList.init();
	//난수리티켓 공통 초기화
	hrTicketCommon.init();
});

// <!-- 난수리 티켓 신청 -->
// <input type="hidden" id="ticket_reg_btn" data-id='dialog_ticket_form' data-width='1200' data-height='80%' data-title='<spring:message code="ts.01.01.003.2"/>' />
// <!-- 난수리 상세 -->
// <input type="hidden" id="ticket_info" data-id='dialog_ticket_view' data-width='1345' data-height='700' data-title='<spring:message code="ts.01.01.003.13"/>' />


// <!-- 난수리 티켓 Form 시작 -->
// <div id="dialog_ticket_form"></div>
// <!-- 난수리 티켓 상세 시작 -->
// <div id="dialog_ticket_view" style="display:none; padding:0;"></div>

//hrTicketList.js 티켓신청 버튼
$("#reg_btn").bind("click", function(e){
    var btnViewYn = $("#hTicketCreateYn").val();    
    if(btnViewYn == 'Y'){
        $("#ticket_reg_btn").trigger("click");
    }else{
        kendo.alert("Please make a service ticket first and use 'Transfer to Tech Support' menu.");
    }
});



var hrTicketCommon = {
    init : function() {
        $("#ticket_reg_btn").bind("click", function(){
            hrTicketCommon.openFormPopup();
        });
        $("#ticket_info").bind("click", function(){
            hrTicketCommon.openViewPopup();
        });
    },
 
 /*
 openFormPopup : function() {

			console.log("hrTicketCommon.openFormPopup(); ........");

			$("#ticket_reg_btn").gsisOpenWindow({
				title : hrTicketCommon._PARAM.title,
				content : "/tech/hrts/hrTicketFormAction.do",
				data : {hdTicketNo : hrTicketCommon._PARAM.hdTicketNo},
				reloadable : false,
				minWidth: 1200,
				animation: {
					open : {effects : "fade:in"},
					close : {effects: "fade:out"}
				},
				close : function(){
					//난수리 티켓 번호 초기화
					hrTicketCommon._PARAM.hdTicketNo = null;
					hrTicketCommon._PARAM.title = $.gsisMsg('ts.01.01.003.2');
					hrTicketCommon._PARAM.snsw = "1";
				}
			});
		},

		/* 난수리티켓 상세 팝업 
		openViewPopup : function() {
			$("#ticket_info").gsisOpenWindow({
				content : "/tech/hrts/hrTicketViewAction.do",
				data : {hdTicketNo : hrTicketCommon._PARAM.hdTicketNo,dashboard : ""},
				reloadable : false,
				//minWidth: 1345,
				minWidth: 1430, // /*  VOC-20200623-005 난수리 ticket 내 글씨 색상 변경할 수 있게 요청   by modify lhj font color 보이기 위해 늘림.
				animation: {
					open : {effects : "fade:in"},
					close : {effects: "fade:out"}
				},
				open : function() {
					kendo.ui.progress($("body"), true);//lhj //VOC-20200305-013,난수리 티켓 번호 클릭시 로딩 마크 표시
					//hrTicketList.refresh();
					$("#dialog_ticket_view").parent().addClass("layer_pop_02");
				},
				close : function(){
					kendo.ui.progress($("body"), false);//lhj //VOC-20200305-013,난수리 티켓 번호 클릭시 로딩 마크 표시
					$("#loadingprogress").hide();//lhj //VOC-20200305-013,난수리 티켓 번호 클릭시 로딩 마크 표시

					//난수리 티켓 목록 갱신

					//난수리 티켓 번호 초기화
					hrTicketCommon._PARAM.hdTicketNo = null;
				}
			});
		},   
    */

/*
		 * 난수리 티켓 목록
		 */
		list : function(){
			var rctYnHideBoolean = true;

			if($("#tsAuth").val() == "HQ" || $("#tsAuth").val() == "SC"){
				rctYnHideBoolean = false;
			}
			var _columns = [
				           {
				        	   headerTemplate: "<input type='checkbox' id='allChk' onclick='techUtil.elementToggleAll(event, \"#grid_type_1\");' />",
				        	   template: "<input type='checkbox' data-bind='checked: checked' value='#: hdTicketNo #' />",
				        	   hidden: true,
				        	   width: "30px"
				           },
				           {
				        	   field: "hdTicketNo",
				        	   title: $.gsisMsg("ts.01.01.003.17"),
				        	   attributes: {style: "text-align:center", "data-name" : "hdTicketNo"},
				        	   template: "<a href='javascript:;' class='link' onclick=\"hrTicketCommon.callTicketInfo('#: hdTicketNo #', '#: pgStatCd #', '#: reqUserId #', '#: ownerId #');\">#: hdTicketNo #</a>",
				        	   width: "100px"
				           },
				           {
				        	   field: "bookmarkYn",
				        	   title: $.gsisMsg("ts.01.01.003.23"),
				        	   attributes: {style: "text-align:center"},
				        	   template: "<button type='button' class='k-button k-primary#: bookmarkYn #' onclick=\"hrTicketList.bookmarkSave('#: hdTicketNo #');\">BM</button>",
				        	   width: "80px"
				           }				          
				           , {
				        	   field: "nonRepairNo",
				        	   title: "Non Repair No",
				        	   width: "120px"
				           }

				];

			var _target = "grid_type_1";
			var _params = function() {
				var data = $("#searchForm").serializeArray();
				data.push({"name":"countryLevel","value":hrTicketList._regionData._regionLevel});
				data.push({"name":"countryCd","value":hrTicketList._regionData._regionCode});
                return techUtil.makeJsonParam(data);
                /*serializeArray() => Json 형식으로 convert
                makeJsonParam : function (_formArray) {
                    var _obj = {};
                    $.each(_formArray, function(i, pair){
                        var _cObj = _obj, _pObj, _cpName;
                        $.each(pair.name.split("."), function(i, pName){
                            _pObj = _cObj;
                            _cpName = pName;
                            _cObj = _cObj[pName] ? _cObj[pName] : (_cObj[pName] = {});
                        });
                        _pObj[_cpName] = pair.value;
                    });
                    return _obj;
                },
                /*
	 * Json 형식의 Object를 view_ + key Id의 <span> 태그에 bind

            setJsonToHtml : function(_json) {
                $.each(_json, function(key, value){
                    $("#view_" + key).html(value);
                });
            },

            /*
            * Json 형식의 Object를 Form의 <input> 태그에 bind

            setJsonToForm : function(_json, _form) {
                $.each(_json, function(key, value) {
                    _form.find("input[name='" + key + "']").val(value);
                });
            },

            getGridTotalCount : function(_target) {
                var grid = $("#" + _target).data("kendoGrid");
                var dataSource = grid.dataSource;
                var totalRecords = dataSource.total();
                return totalRecords;
            },


            * KendoUI check box 세팅
            setCheckBox : function(_target) {
                $("#check_" + _target).bind("click", function(){
                    if($("#check_" + _target).prop('checked')) $("#" + _target).val("Y");
                    else $("#" + _target).val("");
                });
            },

            techajaxJson : function(options){
                var defaults = {
                        url : "/field",			    
                        dataType : "json",
                        type: 'POST',
                        data : {},
                        error: function(r){
                            if ( options.errosMsg != undefined && options.errosMsg != "" ) {
                                console.log(options.errosMsg);
                            }else{
                                console.log($.gsisMsg("am.common.msg.11")/*"에러가 발생했습니다. 관리자에게 문의 해 주세요.");
                            }
                        },
                        success: function(r){
                        }
                }
                $.ajax($.extend(true, {}, defaults, options));
            },	
            
            

            hrTicketCommon.makeHrTicketGrid(_target, _params, _columns, function(e){$("#search_btn").trigger("click");});
            
            
        },
        
/*
   makeHrTicketGrid :  function (_target, _params, _columns, _change) {
    var _dataSource = new kendo.data.DataSource({
        transport : {
            read : {
                  url				: "/tech/hrts/hrTicketListAjax.do",
                  dataType		: "json",
                  data 			: _params,
                  sendDataType 	: "string",
                  type			: "POST",
                  complete:function(){                    
                      $("#totalCnt").html(_dataSource.total());                    
                },
                  error			: function(e){
                       techUtil.alert("Status: " + e.status + "; Error message: " + e.errorThrown);
                }
            }
        },
        schema: {
            data	: "list",
            total 	: "totalCnt"
        },
        serverPaging	: true,
        sortable: {
            mode: "multiple",
            allowUnsort: true,
            showIndexes: true
        },

        pageSize		: 10
    });


    $("#" + _target).kendoGrid({
        dataSource 	: _dataSource,
        columns 	: _columns,
        pageable	: true,
       // scrollable	: false,
        sortable	: true,
        selectable  : false,
        //resizable: true,
        columnMenu	: false,
        reorderable: true,
        resizable: true,
        sortable: true,
        noRecords 	: {template : techCommon.MSG.nodata},
        change		: _change
    }); 
    },
*/
}    



var value = 100;
 
var myObject = {
    value: 1,
    func1: function () {
        var that = this;
 
        this.value += 1;
        console.log('func1() called. this.value : ' + this.value);
 
        func2 = function () {
            that.value += 1;
            console.log('func2() called. this.value : ' + that.value);
 
            func3 = function () {
                that.value += 1;
                console.log('func3() called. this.value : ' + that.value);
            }
            func3();
        }
        func2();
    }
}; 
myObject.func1(); // func1 메서드 호출

// func1() called. this.value : 2
// VM108:13 func2() called. this.value : 3
// VM108:17 func3() called. this.value : 4


S1RNM3HN600005W

VOC-20200923-009,Quality (Defect management) 화면에 검색 필드 추가


