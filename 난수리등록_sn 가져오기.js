

-- sn 가져오기
$("#sn_search_btn").bind("click", function(e){
				var cbSrlNo = $("#combo_srlNo").val();				
				hrTicketForm.getSnInfo(cbSrlNo);				
			});

--
getSnInfo : function(_hospitalId) {
			var _url = "/tech/common/selectInstalledSnListAjax.do";
			var _params = {hospitalId : _hospitalId};
			techCommon.ajax(_url, "json", _params, hrTicketFormCallback.getSnInfo);
		},



--
ajax : function (_url, _type, _params, _onsuccess) {
			$.ajax({
				url 		: _url,
			    async 		: false,
				dataType 	: _type,
				type 		: "post",
				data 		: _params,
				error: function(e){
					 //techUtil.alert("Status: " + e.status + "; Error message: " + e.errorThrown);
				},
				success: function(responseData, statusText){
					if(undefined != _onsuccess){
						_onsuccess(responseData, statusText);
					}
				}
			});
		},


--
//Callback
window.hrTicketFormCallback = {
		/* SN 정보 callback	 */
		getSnInfo : function(data){
			var snInfoList = data.snInfoList;
			if(snInfoList.length > 0) {
				hrTicketForm.makeSnComboBox(snInfoList);
			} else {
				hrTicketForm.initSnComboBox();
			}
		}
}
--selectInstalledSnListAjax.do >> 병원에 설치된 S/N 정보
gsis.tech.common.service.impl.TechCommonMapper.selectInstalledSnList
return jsonView


--hrTicketForm.makeSnComboBox(snInfoList);
		/*
		 * SN 콤보박스 만들기
		 */
		makeSnComboBox : function(_data) {			
			var _dataSource = new kendo.data.DataSource({
				data : _data
			});
			_dataSource.fetch(function(){
				$("#combo_srlNo").attr("hidden", true);

				var _item = _dataSource.data()[0];
				//$("#combo_srlNo").val(_item.srlNo);
				CURRENT_SRL_NO = _item.srlNo;
				console.log(_item.srlNo);
				hrTicketForm.setCascadeValue(_item);
			});
		},

/*
		 * 제품군, 제품, 모델 콤보박스 값 세팅
		 */
		setCascadeValue : function(_item) {
			if(_item) {
				var _prodGrpCd = _item.prodGrpCd;
				var _prodCd = _item.prodCd;
				var _mdlCd = _item.mdlCd;
				var hospitalId = _item.hospitalId;
				var hospitalNm = _item.hospitalNm;
				var tel = _item.tel;
				var chrgUserNm = _item.chrgUserNm;
				var addr = _item.addr;
				var wrtyTermStart = _item.wrtyTermStart
				var wrtyTermEnd = _item.wrtyTermEnd
				var swVer = _item.swVer
				var rlesDate = _item.rlesDate
				var setReqNo = _item.setReqNo

				$("#setReqNo").val(setReqNo);
				techUtil.selectComboBox("combo_prodGrpCd", _prodGrpCd);
				techUtil.selectComboBox("combo_prodCd", _prodCd);
				techUtil.selectComboBox("combo_mdlCd", _mdlCd);
				$("#wrtyTermStart").val(wrtyTermStart);
				$("#wrtyTermEnd").val(wrtyTermEnd);
				$("#swVer").val(swVer);

				console.log("rlesDate::::::::::::"+rlesDate);
				$("#rlesDate").val(rlesDate);
				$("#hospitalId").val(hospitalId);
				$("#hospitalNm").val(hospitalNm);
				$("#tellNo").val(tel);
				$("#custUserNm").val(chrgUserNm);
				$("#addr").val(addr);
				$("#magGlassYn").val("Y");//VOC-20200710-001 난수리 티켓 화면상 설치 안된 SN 표기_[수정 요청] 난수리 티켓 정보 수리 요청
			}
			this.setSnSideInfo(_item);
		},		

--- techUtil.selectComboBox("combo_prodGrpCd", _prodGrpCd);	
	/*
	* KendoUI combo box select
	*/
	selectComboBox : function(_target, _value) {
		var combobox = $("#" + _target).data("kendoComboBox");
		combobox.value(_value);
		combobox.trigger("change");
	},
	
	

---setSnSideInfo
/* 설치 제품 S/N의 연계정보 */
setSnSideInfo : function(_item) {
	//출고일
	var rlesDate = _item.rlesDate;
	//설치일
	var installDate = _item.installDate;
	//워런티 시작일
	var wrtyTermStart = _item.wrtyTermStart;
	//워런티 종료일
	var wrtyTermEnd = _item.wrtyTermEnd;
	//SW Version
	var swVer = _item.swVer;

	$("#rlesDate").val(rlesDate);
	$("#installDate").val(installDate);
	$("#wrtyTermStart").val(wrtyTermStart);
	$("#wrtyTermEnd").val(wrtyTermEnd);
	$("#swVer").val(swVer);
},

