git push -u origin master

//HQ엔지니어
	public static final String AUTH_HQ = "HQ";	
	//HQ하위의 법인 또는 파트너 엔지니어
	public static final String AUTH_TP = "TP";	
	//일반 파트너 엔지니어
	public static final String AUTH_DP = "DP";	
	//법인
	public static final String AUTH_SC = "SC";

$(document).ready(function(){
	techUtil.setStartDate("stdd","365");
	//초기화    
    hrTicketList.init();
	//난수리티켓 공통 초기화
	hrTicketCommon.init();
});


//권한
var TS_AUTH = $("#tsAuth").val();
var lang = $("#lang").val();
var requsernm =null;


var hrTicketList = {
    init : function(){
        hrTicketList.setInitDefault();  //1
        hrTicketList.setInitEvent();    //2 
        hrTicketCommon._PARAM.currentPage = "list";
        hrTicketList.list();
    },

    //1  
    setInitDefault : function(){
        techUtil.setCheckBox("myTicketYn");
        techUtil.setCheckBox("recentYn");
        // setCheckBox : function(_target) {
        //     $("#check_" + _target).bind("click", function(){
        //         if($("#check_" + _target).prop('checked')) $("#" + _target).val("Y");
        //         else $("#" + _target).val("");
        //     });
        // },
        //combobox set
        this.makePgStatCdComboBox();
        /* 진행상태 콤보박스 */
		// makePgStatCdComboBox : function() {
		// 	var args = {
		// 			target : "search_pgStatCd",
		// 			url : techCommon.CODE_URL.pgStatCd,
		// 			data : "comCodeList",
		// 			text : "codeNm",
		// 			value : "codeId",
		// 			appendComboData : {
		// 				"codeNm" : techCommon.MSG.all,
		// 				"codeId" : ""
		// 			}
		// 	};
		// 	techUtil.makeCommonComboBox(args);
        // },
	
/////////////////////////////////////////////////

/*
makeCommonComboBox : function(arg) {
	var excuteDataSource;

	var dataSource = new kendo.data.DataSource({
		transport: {
			read: {
				url: arg.url,
				data : arg.param,  
				dataType: "json",
				cache: false,
				async: false
			}
		},
		schema: {
			data	: arg.data   // "comCodeList"
		}
	});

	dataSource.fetch(function(){
		if(arg.appendComboData != undefined){
			var data = dataSource.data();
			data.unshift(arg.appendComboData);
			excuteDataSource = data;
		}else{
			excuteDataSource = dataSource;
		}
		$("#" + arg.target).kendoComboBox({
			dataSource : excuteDataSource,
			dataTextField		: arg.text,
			dataValueField		: arg.value,
			index				: 0,
			autoWidth			: true,
			autoBind 			: true
		});
		$("#" + arg.target).data("kendoComboBox").input.attr("readonly", true);
		if(arg.callback != undefined){
			arg.callback();
		}
	});
},
*/

		this.makeProdGrpCdComboBox();

/*
       //제품군 콤보박스              
		// makeProdGrpCdComboBox : function() {
		// 	$("#search_prodGrpCd").kendoComboBox({
	    //     	placeholder: $.gsisMsg("sm.common.msg.002"),
	    //     	autoBind: true,
	    //         dataTextField: "prodGrpNm",
	    //         dataValueField: "prodGrpCd",				
	    //         dataSource:[
		// 			{
		// 				   prodGrpNm : "Total",
		// 				   prodGrpCd : ""
		// 			},
	    //            {
	    //         	   prodGrpNm : "DR",
	    //         	   prodGrpCd : "DR"
	    //            },
	    //            {
	    //         	   prodGrpNm : "USS",
	    //         	   prodGrpCd : "USS"
	    //            },
	    //            {
	    //         	   prodGrpNm : "IVD",
	    //         	   prodGrpCd : "IVD"
	    //            },
	    //            {
	    //         	   prodGrpNm : "USP",
	    //         	   prodGrpCd : "USP"
	    //            },
	    //            {
	    //         	   prodGrpNm : "DR-DET",
	    //         	   prodGrpCd : "DR-DET"
	    //            }
	    //         ] ,
		// 		change: function(e){
		// 			var value = this.value();
		// 			var _params = new Object();
		// 			_params.prodGrpCd 	= value;
		// 			_params.pagingYn    = 'N';

		// 	    	//param  = {"prodGrpCd": value, "prodCd": "", "mdlCd": "", "useYn": ""};
		// 			//선택값 초기화
		// 			$('#prodCd').data("kendoComboBox").value("");
		// 			hrTicketList.setProdComboBox("prodCd", "prodNm", "/materials/cust/productListAjaxAction.do", _params );
		// 		}
	    //     }).data("kendoComboBox").input.attr("readonly", true);
		// },
*/
        //제품 콤보박스
        this.setProdComboBox("prodCd", "prodNm", "/materials/cust/productListAjaxAction.do");
	
		/* 제품 콤보박스 */
		// setProdComboBox : function( _valueField, _textField, _url, _params){
		// 	$("#prodCd").kendoComboBox({
	    //     	placeholder: $.gsisMsg("sm.common.msg.002"),
	    //     	autoBind: true,
	    //     	dataTextField: _textField,
	    //      dataValueField: _valueField,
		// 		dataSource:{
		// 			transport: {
		// 				read: {
		// 					url			: "/materials/cust/productListComboAjax.do",
		// 					data 		: _params,
		// 					dataType	: "json"
		// 				}
		// 			},
		// 			schema: {data	: "list"}
		// 		}
	    //     }).data("kendoComboBox").input.attr("readonly", true);
		// },

		//date 콤보 박스        
        this.makeDateComboBox();
		// makeDateComboBox : function () {
		// 	$("#dateCd").kendoComboBox({
		// 		dataTextField: "text",
		// 		dataValueField: "value",
		// 		dataSource: [
		// 			{text: "3"+$.gsisMsg("FS-02-02-001.146"), value: "3m" },// "3개월"
		// 			{text: "6"+$.gsisMsg("FS-02-02-001.146"), value: "6m" },// "6개월"
		// 			{text: "9"+$.gsisMsg("FS-02-02-001.146"), value: "9m" },// "9개월"
		// 			{text: "12"+$.gsisMsg("FS-02-02-001.146"), value: "12m" }// "12개월"
		// 		],
		// 		index: 3
		// 	});
		// 	$("#dateCd").data("kendoComboBox").input.attr("readonly", true);
        // },

        /// 2 
        setInitEvent : function() {
			//푸시알림 버튼
			$("#ticket_push_btn").bind("click", function(e){
				var _data = $("#grid_type_1").find("input[type=checkbox]:checked");
				var closw="0";
				if (_data.length > 0) {
					var englist = new Array();
					$.each(_data, function(i){
						var data = new Object() ;
						 //englist.push(_data.parent().parent("tr:eq(" + i + ")").find("td:eq(14)").text());
						 data.ownerId=_data.parent().parent("tr:eq(" + i + ")").find("td:eq(18)").text()
						 var aa = _data.parent().parent("tr:eq(" + i + ")").find("td:eq(1)").text();

						 if(aa=="N"||aa=="T"||aa=="O"||aa=="C"){
							 closw="1"
							  return false;
						 }
						 englist.push(data);
					});
					if(closw=="1"){
						 kendo.alert($.gsisMsg('ts.common.msg.81'));
						 return false;
					}
					var _params = {jsonParam : JSON.stringify(englist)};

					//푸시알림 전송
					if(techUtil.confirm($.gsisMsg('ts.01.01.003.14'), function(){
						var _url = "/tech/hrts/hrTicketPushAjax.do";
						hrTicketList.ajaxJson({
							url : "/tech/hrts/hrTicketPushAjax.do",  // private static final String AJAX = "jsonView";
							data : _params,
							success: function(r){
							}
						});
					}));
				} else {
					kendo.alert($.gsisMsg('FS-02-03-001.41'));
				}

	/* * Confirm 창	 */
	/*confirm : function(_msg, _succFunc, _failFunc, _width) {
		var html = "<div id=\"_CONFIRM\"></div>";

		$("body").find("#_CONFIRM").remove();
	    $("body").append(html);

		if (_width == undefined) {
			_width = 300;
		}

		var confirm = $("#_CONFIRM").kendoConfirm({
			content	: _msg,
			width	: _width,
			messages:{
				okText: "OK",
				cancel: "CANCEL"
			}
		}).data("kendoConfirm").result.done(function(){
			if (_succFunc != undefined && _succFunc != '') {
				_succFunc();
			}
		}).fail(function(){
			if (_failFunc != undefined && _failFunc != '') {
				_failFunc();
			}
		});
	},
*/
			});


			
/*
//1.javascript array object push , 다른 배열에 옮긴다.
var data = [];
data[0] = { "ID": "1", "Status": "Valid" };
data[1] = { "ID": "2", "Status": "Invalid" };
var tempData = [];
for ( var index=0; index<data.length; index++ ) {
    if ( data[index].Status == "Valid" ) {
        tempData.Push( data );
    }
}
data = tempData;


2. javascript array -> json 형태로 변환한다.
JSON.stringify(value, replacer, space)
value(필수): JSON 문자열로 변환할 값이다.(배열, 객체, 또는 숫자, 문자 등이 될 수 있다.)
2-1)
Stringify a JavaScript Object
var obj = { name: "John", age: 30, city: "New York" };
var myJSON = JSON.stringify(obj);
{"name":"John","age":30,"city":"New York"}

2-2)
Stringify a JavaScript Array
var arr = [ "John", "Peter", "Sally", "Jane" ];
var myJSON = JSON.stringify(arr);
["John","Peter","Sally","Jane"]


3.제이쿼리, find() 함수 사용법! children() 함수와의 차이점
find() 함수는 
var allListElements = $( "li" );
$( "li.item-ii" ).find( allListElements);

$( "li.item-ii" ).find( "li" ).css( "background-color", "red" );

children()함수는 
$("#tbl1 tbody").children("tr:first");

*/ 

/*
@RequestMapping (value = "hrTicketPushAjax.do")
	public String hrTicketPushAjax (ModelMap model, HttpServletRequest request, @RequestParam ("jsonParam") String jsonParam) {
		try {
			String json = StringEscapeUtils.unescapeHtml(jsonParam);

			ObjectMapper mapper = new ObjectMapper();
			ArrayList<LoginVO> deleteList = mapper.readValue(json, TypeFactory.defaultInstance().constructCollectionType(List.class, HardTicketVO.class));
			HardTicketVO hardTicketVo = new HardTicketVO();
			hardTicketVo.setDeleteList2(deleteList);
	        //String singleId= hardTicketVo.getSingleId();
	        //hardTicketVo.setSingleId(singleId);

			ArrayList<LoginVO> mailToList = new ArrayList<LoginVO>();
			ArrayList<HardTicketVO> deleteList2 = (ArrayList<HardTicketVO>) this.hrTicketService.selectSpush(hardTicketVo);
			PushVO vo = new PushVO();
			if(deleteList2 != null && deleteList2.size()>0){
	        	for(int i=0; i<deleteList2.size() ; i++){
	        		HardTicketVO mailUser = deleteList2.get(i);
	        		LoginVO mailUserIn = new LoginVO();
	        		log.debug("@@mailUser : " + mailUser.getSingleId());
	        		mailUserIn.setSingleId(mailUser.getSingleId());
	        		vo.setTo(mailUser.getSingleId());
	        		vo.setReceiverNm(mailUser.getUserNm());
	        		vo.setSubject(gsisMessageSource.getMessage("ts.common.msg.82"));

	        		message.sendPush(vo);
	        	}
			}

			//private  ArrayList<LoginVO>  deleteList2;
			//public void setDeleteList2(ArrayList<LoginVO> deleteList2) {
			//	this.deleteList2 = deleteList2;
			//}
			//public ArrayList<LoginVO> getDeleteList2() {
			//	return deleteList2;
			//}

	   		//vo.setToList(mailToList);
	   		log.debug("@@mailToList : " + mailToList);
	   		log.debug("@@mailToList : " + vo.getToList());
	   		//deleteList = this.hrTicketService.selectSemail(Integer.parseInt(hardTicketMemoVo.getOwnerId()));

		 	vo.setReceiverNm("Receiver");
			vo.setSubject(gsisMessageSource.getMessage("ts.common.msg.82"));
			vo.setText(PushMessageVO.setSimpleText( gsisMessageSource.getMessage("ts.common.msg.82") ));
	        //요청자 메일
			//message.sendPush(vo);

			model.addAttribute("result", TechConstants.RESULT_CD_SUCCESS);
		} catch(Exception ex) {
			log.debug(ex);
			model.addAttribute("result", TechConstants.RESULT_CD_FAIL);
		}

		return AJAX;
	}
*/


			//날짜
			$("#dateCd").bind("change", function(e) {
				$(this).val() == "3m" && (function() {
					currentDate = new Date();
					$("#stdd").data("kendoDatePicker").value(new Date(currentDate.setMonth(currentDate.getMonth() - 3)));
					$("input[name=endDate]").data("kendoDatePicker").value(new Date());
				})()
				$(this).val() == "6m" && (function() {
					currentDate = new Date();
					$("#stdd").data("kendoDatePicker").value(new Date(currentDate.setMonth(currentDate.getMonth() - 6)));
					$("input[name=endDate]").data("kendoDatePicker").value(new Date());
				})()
				$(this).val() == "9m" && (function() {
					currentDate = new Date();
					$("#stdd").data("kendoDatePicker").value(new Date(currentDate.setMonth(currentDate.getMonth() - 9)));
					$("input[name=endDate]").data("kendoDatePicker").value(new Date());
				})()
				$(this).val() == "12m" && (function() {
					currentDate = new Date();
					$("#stdd").data("kendoDatePicker").value(new Date(currentDate.setMonth(currentDate.getMonth() - 12)));
					$("input[name=endDate]").data("kendoDatePicker").value(new Date());
				})()
			});
			$("#dateCd").trigger("change");

			//// 국가팝업 이벤트id="btn_regionNation"
			$("#btn_regionNation").on("click",function() {
				common.regionSearch.window({
					depth : 2,
					title: $.gsisMsg('customer.infolist.046'),//"국가선택"
					multiCheck : false,
					open : function() {
						//kendo.alert("지역 검색 해보세요!");
					},
					callbackFunc : function(value) {
						countryCd = value[0].areaCd;
						countryNm = value[0].regionNm;
						$("#countryNm").val(countryNm);

						hrTicketList._regionData._regionNm = value[0].regionNm;
						hrTicketList._regionData._regionCode = value[0].areaCd;
						hrTicketList._regionData._regionLevel = value[0].regionLevel;
					}
				})
			});


			//티켓신청 버튼
			$("#reg_btn").bind("click", function(e){
				var btnViewYn = $("#hTicketCreateYn").val();

				//alert(btnViewYn);
				if(btnViewYn == 'Y'){
					$("#ticket_reg_btn").trigger("click");
				}else{
					kendo.alert("Please make a service ticket first and use 'Transfer to Tech Support' menu.");
				}
			});
	/*
		<!-- 난수리 티켓 신청 -->
		<input type="hidden" id="ticket_reg_btn" data-id='dialog_ticket_form' data-width='1200' data-height='80%' data-title='<spring:message code="ts.01.01.003.2"/>' />
		
		<!-- 난수리 티켓 Form 시작 -->
		<div id="dialog_ticket_form"></div>
	*/


/*
	var hrTicketCommon = {
		_PARAM : {
			hdTicketNo : null,
			title : $.gsisMsg('ts.01.01.003.2'),
			snsw : "0",
			currentPage : null,
			reqUserId : null,
			ownerId : null
		},

		init : function() {
			$("#ticket_reg_btn").bind("click", function(){ // 난수리 신청 
				hrTicketCommon.openFormPopup();
			});

			$("#ticket_info").bind("click", function(){    //상세
				hrTicketCommon.openViewPopup();
			});
		},

		/* 난수리티켓 신청 폼 팝업 */
		openFormPopup : function(){  //common.js ->$.fn.gsisOpenWindow = function(o) {
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
/* 		난수리티켓 상세 팝업 
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
			
			//엑셀다운로드 버튼
			$("#ticket_excel_btn").bind("click", function(e){
				var args = {
						url : "/tech/hrts/hrTicketExcelDownAjax.do",
						params : techUtil.makeJsonParam($("#searchForm").serializeArray())
						
						/* serializeArray() => Json 형식으로 convert 	
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
						}, */
				}
				techUtil.postForm(args);
				/**
				 *  post 형식으로 form 생성 후 submit
				 *  argument 를 object 로 넘기면 form 을 생성하여 submit 한다.
				 *  url는 서버 uri, params는 parameter
					ex)
					var args = {
						url : '/tech/hrts/hrTicketExcelDownAjax.do',
						params : {
							hdTicketNo : "T12321",
							pgStatusCd : "R"
						}
					};

					techUtil.postForm(args);
				*/
				/*postForm : function(args) {
					var form = $('<form></form>');
					form.attr('action', args.url);
					form.attr('method', 'post');
					form.appendTo('body');
					if(args.params){
						for(var key in args.params){
							var value = args.params[key];
							form.append($('<input type="hidden" value="'+ value + '" name="' + key + '">'));
						}
					}
					form.submit();
				},*/
			});
			
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var techUtil = {
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
    postForm : function(args) {
        var form = $('<form></form>');
        form.attr('action', args.url);
        form.attr('method', 'post');
        form.appendTo('body');
        if(args.params){
            for(var key in args.params){
                var value = args.params[key];
                form.append($('<input type="hidden" value="'+ value + '" name="' + key + '">'));
            }
        }
        form.submit();
    }
}

    var args = {
            url : "/tech/hrts/hrTicketExcelDownAjax.do",
            params : techUtil.makeJsonParam($("#searchForm").serializeArray())           
    }

    console.log(args) ;
    techUtil.postForm(args);
  

<form id="searchForm">
      <input type="text" name="a" value="1"/>
      <input type="text" name="b" value="2"/>
      <input type="text" name="c" value="3"/>
</form>

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


			//삭제 버튼
			$("#ticket_delete_btn").bind("click", function(e){
				hrTicketList.deleteCheckedTickets();
			});

			//새로고침 버튼
			$("#ticket_refresh_btn").bind("click", function(e){
				hrTicketList.refresh();
			});

			//Configuration 클릭
			$(".btn_config").on("click",function(){
				common.userField.window({
					target : this,
					position : "target right",
					grid : "grid_type_1",
					title : $.gsisMsg("ts.common.msg.61")
				})
			});

			//난수리 승인 번호 등록
			$("#create_non_repair_no_btn").bind("click", function(e){
				var _data = $("#grid_type_1").find("input[type=checkbox]:checked");
				var closw="0";
				if(_data.length == 1){

					//console.log(_data.parent().parent("tr:eq(0)"));
					var nonRepairNoVal =_data.parent().parent("tr:eq(0)").find("td:eq(23)").text();
					//pgStatCdVal, hdTicketNoVal 받아 와야됨
					var pgStatCdVal =_data.parent().parent("tr:eq(0)").find("td:eq(2)").find("Strong").text();
					var hdTicketNoVal = _data.parent().parent("tr:eq(0)").find("td:eq(1)").find("a").text();
					var corpAuth = $("#tsAuth").val();

					//console.log("pgStatCdVal :" +pgStatCdVal );
					//console.log("hdTicketNoVal :" +hdTicketNoVal );
					if(corpAuth != "HQ"){
						kendo.alert($.gsisMsg("FS-01-02-002-1.195"));
						return -1;
					}

					//담당자 지정 이후에 가능하도록 처리
					if(pgStatCdVal == "T" || pgStatCdVal == "N" || pgStatCdVal == "O"){

						kendo.alert($.gsisMsg("ts.common.msg.100"));

						return -1;
					}

					console.log("nonRepairNoVal :" +nonRepairNoVal );
					if(nonRepairNoVal.length > 0){

						kendo.alert($.gsisMsg("ts.common.msg.101"));//이미 승인된 티켓입니다.
						return -1;
					}
					//난수리 승인
					kendo.confirm($.gsisMsg("ts.common.msg.103")).done(function(){//"난수리 승인 하시겠습니까?"
						hrTicketList.ajaxJson({
							url : "/tech/hrts/createNonRepairNo.do",
							data : {
								hdTicketNo : hdTicketNoVal
							},
							success: function(r){
								if(r.result > 0){
									$("#ticket_refresh_btn").trigger("click");
									kendo.alert($.gsisMsg('success.success'));
								}
							}
						});
			        }).fail(function(){

			        });
				}else if (_data.length > 0) {
					kendo.alert($.gsisMsg('gov.srv.001.11'));//항목을 하나만 선택해 주세요.
				} else {
					kendo.alert($.gsisMsg('FS-02-03-001.41'));
				}
			});

        },


        ajaxJson : function(options){
			var defaults = {
				    url : "/tech/",
					dataType : "json",
					type: 'POST',
					data : {},
					error: function(r){
					},
					success: function(r){
					},
				}

			$.ajax($.extend(true, {}, defaults, options));
        },
    },

		//상세조회 버튼
		$("#search_btn").bind("click", function(e){
			hrTicketList.list();
		});



    ///3 
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
                           field: "pgStatCd",
                           title: $.gsisMsg('ts.01.01.003.3'),
                           attributes: {style: "text-align:center"},
                           template: "<strong class='icon_cir type#: pgStatCd #'>#: pgStatCd #</strong>",
                           width: "105px"
                       },
                       { field: "isSpecial" , title: "SH", attributes: {style:"text-align:center"}, width: "50px", template: "#if(isSpecial== 'Y'){#<strong class='icon_cir typeB'>S</strong>#}else{# #}#"},//Special관리 병원 여부
                       {
                           field: "prodCdName",
                           title: $.gsisMsg("ts.01.01.005.9"),
                           attributes: {style: "text-align:center"},
                           width: "100px"
                       },
                       {
                           field: "reqregionnm",
                           title: $.gsisMsg("FS-01-02-001-1.5"),
                           width: "100px"
                       },
                       {
                           field: "title",
                           title: $.gsisMsg("ts.01.01.003.11"),
                           attributes: {style: "text-align:left"},
                           width: "400px"
                       },
                       {
                           field: "reqUserCorpIdName2",
                           title: $.gsisMsg("ts.01.01.018.038"),
                           attributes: {style: "text-align:center"},
                           width: "150px"
                       },
                       {
                           field: "reqUserIdName2",
                           title: $.gsisMsg("ts.01.01.003.5"),
                           attributes: {style: "text-align:center"},
                           width: "80px"
                       },
                       {
                           field: "ownerIdName2",
                           title: $.gsisMsg("ts.01.01.003.6"),
                           attributes: {style: "text-align:center"},
                           width: "100px"
                       },
                       {
                           field: "regDt",
                           title: $.gsisMsg("ts.01.02.001.011"),
                           attributes: {style: "text-align:center"},
                           width: "130px"
                       },
                       {
                           field: "procReqDate",
                           title: $.gsisMsg("ts.01.01.003.24"),
                           attributes: {style: "text-align:center"},
                           width: "130px"
                       },
                       {
                           field: "currentUpdateDt",
                           title: $.gsisMsg("ts.01.01.003.22"),
                           attributes: {style: "text-align:center"},
                           width: "130px"
                       },
                       {
                           field: "prodGrpCdName",
                           title: $.gsisMsg("ts.01.01.003.8"),
                           attributes: {style: "text-align:center"},
                           width: "120px"
                       },
                         {
                           field: "mdlCdName",
                           title: $.gsisMsg("ts.01.01.003.9"),
                           attributes: {style: "text-align:center"},
                           width: "120px"
                       },
                       {
                           field: "srlNo",
                           title: $.gsisMsg("ts.01.01.003.12"),
                           attributes: {style: "text-align:center"},
                           width: "150px"
                       },
                       {
                           field: "gticketNo",
                           title: $.gsisMsg("ts.01.01.003.1000"),
                           attributes: {style: "text-align:center", "data-name" : "hdTicketNo"},
                           width: "100px"
                       },
                       {
                           field: "hospitalIdName2",
                           title: $.gsisMsg('ts.01.01.003.7'),
                           width: "250px"
                       },

                       {
                           field: "rctYn",
                           title: "L2 → L3",
                           attributes: {style: "text-align:center"},
                           width: "80px",
                           hidden : rctYnHideBoolean
                       },
                       {
                           field: "rePgYn",
                           title: $.gsisMsg("ts.common.msg.38"),
                           attributes: {style: "text-align:center"},
                           width: "100px"
                       },
                       {
                           field: "bookmarkYn",
                           title: $.gsisMsg("ts.01.01.003.23"),
                           attributes: {style: "text-align:center"},
                           template: "<button type='button' class='k-button k-primary#: bookmarkYn #' onclick=\"hrTicketList.bookmarkSave('#: hdTicketNo #');\">BM</button>",
                           width: "80px"
                       },
                       {
                           field: "l4TransferYn",
                           title: $.gsisMsg("ts.01.01.006.1000"),
                           attributes: {style: "text-align:center"},
                           width: "80px"
                       }
                       , {
                           field: "reqUserId",
                           hidden: true,
                           width: "80px"
                       }
                       , {
                           field: "ownerId",
                           hidden: true,
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
        };

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
							// 총 카운트	
		          	    	$("#totalCnt").html(_dataSource.total());							
						},
		          	    error: function(e){
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
                sortable	: true,
                selectable  : false,                
                columnMenu	: false,
                reorderable: true,
				resizable: true,
				sortable: true,
                noRecords 	: {template : techCommon.MSG.nodata},
		        change		: _change
			});

	*/

    //난수리 티켓 삭제
    deleteCheckedTickets : function() {
        var _deleteList = [];
        var _data = $("#grid_type_1").find("input[type=checkbox]:checked");

        if (_data.length > 0) {
            var json = new Array() ;

            $.each(_data, function(i){
                var data = new Object() ;
                var _value = $(this).val();

                if (_value != 'on') {
                    data.hdTicketNo = _value;
                    json.push(data);
                }
            });

            //삭제 하시겠습니까?
            if(techUtil.confirm($.gsisMsg("ts.common.msg.1"), function(){
                var _url = "/tech/hrts/hrTicketDeleteAjax.do";
                var _params = {jsonParam : JSON.stringify(json)};

                techCommon.ajax(_url, 'json', _params, hrTicketListCallback.deleteCheckedTickets);
            }));
        } else {
            kendo.alert($.gsisMsg('ts.common.msg.49'));
        }
	},

/*	
	@RequestMapping (value = "hrTicketDeleteAjax.do")
	public String hrTicketDeleteAjax (ModelMap model, HttpServletRequest request, @RequestParam ("jsonParam") String jsonParam) {
		try {			
			String json = StringEscapeUtils.unescapeHtml(jsonParam);
			ObjectMapper mapper = new ObjectMapper();
			List<HardTicketVO> deleteList = mapper.readValue(json, TypeFactory.defaultInstance().constructCollectionType(List.class, HardTicketVO.class));

			HardTicketVO hardTicketVo = new HardTicketVO();
			LoginVO loginVo = TechUtil.getSession(request);
			hardTicketVo.setSession(loginVo);
			hardTicketVo.setDeleteList(deleteList);
			this.hrTicketService.deleteHrTicket(hardTicketVo);
			model.addAttribute("result", TechConstants.RESULT_CD_SUCCESS);
		} catch(Exception ex) {
			log.debug(ex);
			model.addAttribute("result", TechConstants.RESULT_CD_FAIL);
		}
		return AJAX; //private static final String AJAX = "jsonView";
	}
	<update id="deleteHrTicket" parameterType="hardTicketVO">
		UPDATE TB_T_HARDTICKET
		<set>
			DEL_YN = 'Y',
			UPDATE_USER_ID = #{updateUserId, jdbcType = VARCHAR},
			UPDATE_DT = GETDATE(),
		</set>
		<where>
			<foreach collection="deleteList" item="hardTicketVo" index="index" open = "(" separator=" OR " close=")">
				HD_TICKET_NO = #{hardTicketVo.hdTicketNo}
		</foreach>
		</where>
	</update>
*/