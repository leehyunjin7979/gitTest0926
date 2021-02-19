---------------------------------------------
setPopup: function() {

		$("#popup_quick_search").kendoPopup({
			origin : "top center",
			animation : false,
			appendTo : $(".page-content .page-bar")
		});

		//녹취파일 등 팝업
		$("#dialog_sound_file").kendoWindow({
			height : 300,
			width : 500,
			modal : true,
			visible : false,
			title : $.gsisMsg("customer.js.common.028"),//"녹취파일"
			animation : {
				close : false,
				open : false
			}
		});
		function dialog_sound_file_open() {
			$("#dialog_sound_file").data("kendoWindow").center().open();
		}
	},


<!-- 녹취파일 등록팝업 -->
<%@ include
	file="/WEB-INF/jsp/gsis/customer/tick/popup/RegRecordFile.jsp"%>



<div id="dialog_sound_file" style="display: none;">

---------------------------------------------	
콤보박스 

input_rcptClsCd : $("#searchForm input[name=rcptClsCd]"), // 상담구분


customerRecepitList._searchFormValues.rcptClsCd = (function() {
				if(customerRecepitList._ids.views.input_rcptClsCd.val().trim() == "ALL") {
					return null;
				} else {
					return customerRecepitList._ids.views.input_rcptClsCd.val().trim();
				}
			})();
			
			
// 접수유형
		customerRecepitList._ids.views.input_rcptClsCd.kendoComboBox({
			dataTextField: "codeNm",
			dataValueField: "codeId",
			dataSource: new kendo.data.DataSource({
				transport : {
					read : {
						url : customerRecepitList._CODE_URL.rcptClsCd,
						dataType : "json",
						sendDataType : "string",
						type : "POST",
						error : function() {
							failAlert("Ajax Error...");
						}
					},
					// parameterMap : _parameterMap,
				},
				schema : {
					data : "comCodeList",
					parse: function(data) {
						data.comCodeList.unshift({ "codeNm" : $.gsisMsg("customer.js.common.143"), "codeId" : "ALL" });// "전체"
						return data;
					}
				},
			}),
			index: 0,
		});


$.each(implServiceTicket.rV.o.input_rcptClsCd.data("kendoComboBox").dataSource.data(), function(index, value) {
								value.value == "EG"
									&& implServiceTicket.rV.o.input_rcptClsCd.data("kendoComboBox").select(index)
									&& implServiceTicket.rV.o.input_rcptClsCd.data("kendoComboBox").enable(false);
							});		

--------------------------------------------------------------------

$("#popup_quick_search").kendoPopup({
	origin : "top center",
	animation : false,
	appendTo : $(".page-content .page-bar")
});

var $pop_quick_search = $("#popup_quick_search").data("kendoPopup");
$("#ip_search").focusin(function() {
	$pop_quick_search.open();
});

$("#popup_quick_search .btn_pop_close").click(function() {
	$pop_quick_search.close();
});




-----------softwareList.js
setDropDown($("#popProdGrpCd"),software.dropdownInit.prodGrpList,software.dropdownInit.prodOps("prodGrpCd"));

dropdownInit : {
			/** kendo dropdown 초기화 **/
			attrList    : getCommonJsonList("/common/getComCodeAjax.do",{"codeGroupId":"F014"}),
			importance  : getCommonJsonList("/common/getComCodeAjax.do",{"codeGroupId":"F011"}),
            techType    : getCommonJsonList("/common/getComCodeAjax.do",{"codeGroupId":"F010"}),
            comCodeOps  : {dataTextField:"codeNm",dataValueField:"codeId"},
            prodList    : getProdInfo("prodCd"),
            prodGrpList : getProdInfo("prodGrpCd"),
            prodOps     : function(division){
            	if(division == "prodCd"){
            		return {dataTextField:"prodNm",dataValueField:"prodCd"}
            	}else{
            		return {dataTextField:"prodGrpNm",dataValueField:"prodGrpCd"}
            	}
            }
}	

/**
 * 제품군, 제품 정보 가져와 데이터 리턴.
 * @param division
 */
function getProdInfo(division, prodGrpCd){
	var params = {"division":division};
	if(prodGrpCd != "" && prodGrpCd != undefined && prodGrpCd != null){
		params["prodGrpCd"] = prodGrpCd;
	}
	var arr = new Array();
	$.ajax({
		url : "/field/fild/searchProdInfo.do",
		type: "POST",
		data: JSON.parse(JSON.stringify(params)),
		async:false,
		success : function(r){
			arr = r.list;
		},
		error : function(){
			var msg = (division == "prodCd" ? $.gsisMsg("FS-02-03-003.2"):$.gsisMsg("FS-02-03-003.1")) + $.gsisMsg("FS-02-03-003.41");
			fieldUtil.alert(msg);
		}
	});
	return arr;
}


/**
 * Kendo UI Drop Down
 * @param el	      : kendoDropDown 적용시킬 Element
 * @param codeGroupId : dropdown <option> text, value
 * @param ops         : el.kendoComboBox() option
 * @param isNotBlank  : 첫 <option>이 빈 데이터인지 여부
 * 						-> true일 경우 공백 없이 세팅
 */
function setDropDown(el, item, ops, isNotBlank){
	var arr = new Array();

	var defaultOps = {
						dataTextField: "text",
						dataValueField: "value",
						dataSource: [],
						index: 0
					};
	var options = $.extend(true,{}, defaultOps, ops);
	if(isNotBlank){
		arr = item;
	}else{
		var tmp = {};
		tmp[options.dataTextField] = "";
		tmp[options.dataValueField] = "";
		arr = $.merge([tmp],item);
	}
	options.dataSource = arr;
	$(el).kendoComboBox(options);
	$(el).data("kendoComboBox").input.attr("readOnly",true);
}
