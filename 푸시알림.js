8$(document).ready(function(){
	techUtil.setStartDate("stdd","365");
	//초기화
	hrTicketList.init();
	//난수리티켓 공통 초기화
	hrTicketCommon.init();// 
/*
	init : function() {
		//난수리티켓 신청 
		$("#ticket_reg_btn").bind("click", function(){
			hrTicketCommon.openFormPopup();
		});
		// 난수리 상세 
		$("#ticket_info").bind("click", function(){
			hrTicketCommon.openViewPopup();
		});
	},

	/* 난수리티켓 신청 폼 팝업 
	openFormPopup : function() {
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
				hrTicketCommon._PARAM.hdTicketNo = null;
				hrTicketCommon._PARAM.title = $.gsisMsg('ts.01.01.003.2');
				hrTicketCommon._PARAM.snsw = "1";
			}
		});
	},
*/


});



init : function(){
			hrTicketList.setInitDefault();
			hrTicketList.setInitEvent();
			hrTicketCommon._PARAM.currentPage = "list";
			hrTicketList.list();
		},


/*
		 * 난수리티켓 목록 기본설정
		 */
setInitDefault : function() {
			
			techUtil.setCheckBox("myTicketYn");
			techUtil.setCheckBox("recentYn");
/*
			setCheckBox : function(_target) {
				$("#check_" + _target).bind("click", function(){
					if($("#check_" + _target).prop('checked')) $("#" + _target).val("Y");
					else $("#" + _target).val("");
				});
			},
*/		
			//combobox set
			this.makePgStatCdComboBox();// /* 진행상태 콤보박스 */

			//제품군 콤보박스
			this.makeProdGrpCdComboBox();
			//제품 콤보박스
			this.setProdComboBox("prodCd", "prodNm", "/materials/cust/productListAjaxAction.do");
			//date 콤보박스
			this.makeDateComboBox();

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
	}		
setInitEvent : function() {
			//푸시알림 버튼
			$("#ticket_push_btn").bind("click", function(e){
				var _data = $("#grid_type_1").find("input[type=checkbox]:checked");
				var closw="0";
				if (_data.length > 0) {
					var englist = new Array();
					$.each(_data, function(i){
						var data = new Object() ;						
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
							url : "/tech/hrts/hrTicketPushAjax.do",
							data : _params,
							success: function(r){
							}
						});
					}));
				} else {
					kendo.alert($.gsisMsg('FS-02-03-001.41'));
				}
			});
}            

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

2-2)
Stringify a JavaScript Array
var arr = [ "John", "Peter", "Sally", "Jane" ];
var myJSON = JSON.stringify(arr);
:: ["John","Peter","Sally","Jane"]


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