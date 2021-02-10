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
