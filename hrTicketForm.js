/**
 * 기술지원 난수리 티켓 등록/수정 자바스크립트
*/

//제어용 변수
var CURRENT_SRL_NO = null;

var hrTicketForm = {
		/*
		 * 컨텐츠 default 내용
		 */
		_contents : {
			E : '<pre>□ Call Registration Information<br><br>' +
			/*'<br><br><font color="blue"> ∙ Occurrence Frequency</font> : <font color="black"> <br><br>' +
			'<font color="blue"> ∙ Defect Symptoms</font> :<font color="black">  <br><br>' +
			'<font color="blue"> ∙ Error Code / Message</font> :<font color="black"><font color="black">  <br><br>' +
			'<font color="blue"> ∙ Performed Service Actions/History</font> :  <br><br>' +
			'<font color="blue"> ∙ Replaced/Tested Parts</font> :<font color="black">  <br><br>' +
			'<font color="blue"> ∙ System Status</font> :<font color="black">  <br><br>' +
			'<font color="blue"> ∙ Patient Impact</font> :<font color="black">  <br><br>' +
			'<font color="blue"> ∙ Attach the necessary files for analysis</font><font color="black"><br><br>' +
			'<font color="blue">  (Please attached the  Service request form  (IVD),  Log files  (US), etc.,)</font><font color="black"><br><br>' +
			'<font color="blue"> ∙ Comment</font> :<font color="black">  <br><br>' +*/

			'<br><br><font color="blue"> ∙ Issued S/W Version</font> : <font color="black"> <br><br>' +
			'<font color="blue"> ∙ Used Probe</font> :<font color="black">  <br><br>' +
			'<font color="blue"> ∙ Issued Date/time</font> :<font color="black"><font color="black">  <br><br>' +
			'<font color="blue"> ∙ System Status</font> :  <br><br>' +
			'<font color="blue"> ∙ Problem Type</font> :<font color="black">[] H/W Problem       [] S/W Problem     [] External Device </font>  <br><br>' +
			'<font color="blue"> ∙ Issue Description</font> :<font color="black">  <br><br>' +
			'<font color="blue"> ∙ Service Action history</font> :<font color="black">  <br><br>' +
			'<font color="blue"> ∙ Repair Parts</font> :<font color="black"><br><br>' +
			'<font color="blue"> ∙ Error Frequency</font> :<font color="black">[ ] Always      [ ] Everyday       [ ] Intermittently (  / week)</font><br><br>' +
			'<font color="blue"> ∙ Log File</font> :<font color="black">[ ] Attached      [ ] Not Attached</font><br><br>' +
			'<font color="blue"> ∙ User Preset</font> :<font color="black">[ ] Attached      [ ] Not Attached</font><br><br>' +
			'<font color="blue"> ∙ Diagnostic data</font> :<font color="black">[ ] Attached      [ ] Not Attached</font><br><br>' +
			'<font color="blue"> ∙ Defect Picture</font> :<font color="black">[ ] Attached      [ ] Not Attached</font><br><br>' +


			'<font color="red">* If you don\'t submit the necessary information, Technical support could be limited.</font><font color="black"></pre>',
		P : '□ Text version of PDR report<br><br>' +
			'  * All the guideline in “Defective Probe Check Guide” has been performed (Yes / No) :<br><br>' +
			'  * Probe name and S/N :<br><br>' +
			'  * Occurrence Frequency (Every time, Daily, Weekly, Monthly, Once) :<br><br>' +
			'  * Defect Symptoms (Error message or code) :<br><br>' +
			'  * Performed Service Actions/History :<br><br>' +
			'  * Replaced probe is OK to use :<br><br>' +
			'  * System Status :<br><br>' +
			'  * Name of Disinfectant :<br><br>' +
			'  * Attach the defective image and photo for analysis<br>' +
			'    (1.Ultrasound image, 2.Surface of probe lens, 3.Strain Relief, Cable status)<br><br>' +
			'  * Comment :<br><br>' +
			'  * If you do not submit the necessary information, Technical support could be limited. ' ,
		D : '□ Text version of DDR report<br><br>' +
			'  * Installation date :<br><br>' +
			'  * Detector Information (Model, S/N, F/W) :<br><br>' +
			'  * Defect Symptoms / image data :<br><br>' +
			'  * Occurrence Frequency :<br><br>' +
			'  * Pictures (Detector housing / Shock sensor / Connector etc.,) :<br><br>' +
			'  * Performed Service Actions/History :<br><br>' +
			'  * Comment :',
		S : '○ the considerations which are influential in the location of the system<br>' +
			'  (ex. Column, furniture custom-built to fit the size of a room, window)<br><br>' +
			' * Attach the necessary files for supporting the drawing (Please attached the CAD file)' +
			' * If you dont submit the necessary information, to support the drawing could be limited.' +
			' * Since site plan is required for the device layout, additional job tasks like including the drawing of the fluoroscopy room  and attaching additional comments are your responsibility.'
		},

		/*
		 * 초기화
		 */
		init : function(){
			hrTicketForm.setInitDefault();
			hrTicketForm.setInitEvent();
			var tsAuth = $("#tsAuth").val();
			var combosrlno =   $("#combo_srlNo").val();
			//20180502  mod -  유재희 차장 요청으로 HQ인 경우도 저장버튼 노출되도록 처리
			/*if(tsAuth=="HQ")
			{
				$("#ticket_save").hide();
				$("#temp_ticket_save").hide();
			}*/
			if(combosrlno!=''){
			$("#sn_search_btn").trigger("click");
			}


		},

		/*
		 * 초기 화면 설정
		 */
		setInitDefault : function() {
			this.makeComboBox();
			this.makeEditor();

			this.setProcessRequestInfo($("#combo_reqTypeCd").val());

			//첨부파일
			this.makeUploadView();
			//techCommon.kendoFile("hrTicketFile", "hrTicketFileTempSeq");

			//raonupload 이벤트 호출
			raonUploadSetting("uploadHolder1","kupload1");

		},
		formevent : function() {

			$("#sn_search_btn").trigger("click");
		},
		/*
		 * 초기 이벤트 설정
		 */
		setInitEvent : function() {

			//VOC-20210203-003 [수정] 난수리 TICKET에 소문자 입력되는 이슈
			$("#combo_srlNo").bind("keyup",function(){
				$(this).val($(this).val().toUpperCase());
			});

			//병원 검색 팝업
			$("#hospital_search_btn").bind("click", function() {
				common.searchHospitalGenerateView.window({
					layer: "dialog_searchHospitalGenerateView",
					open : function() {
					},
					loadJS : function() {
						this.loadHierachicJS("implSearchHospital", "/common/js/customer/cust/implSearchHospital.js");
					},
					callbackFunc : {
						selectEvent : function(parent, data) {
							$("#hospitalNm").val(data.hospitalNm);
							$("#hospitalId").val(data.hospitalId);
							$("#tellNo").val(data.tel);
							$("#addr").val(data.addr);
							parent.closeWindow();
						},
					}
				});
			});

			$("#searchInstallProdButton").bind("click", function(e){

				console.log($("#hospitalId").val());

				if($("#hospitalId").val() == null || $("#hospitalId").val() == '') {
					kendo.alert($.gsisMsg('customer.js.common.232'));//"병원을 검색해 주십시오."
					return;
				}


				common.searchInstallProdView.window({
					layer: "dialog_searchInstallProdView",
					title: $.gsisMsg('customer.recepitList.047'),//"설치정보"
					hospitalId: $.trim($("#hospitalId").val()),
					open : function() {
						//kendo.alert("서비스티켓을 등록해 보세요");
					},
					loadJS : function() {
						this.loadHierachicJS("implSearchInstallProd", "/common/js/customer/cust/implSearchInstallProd.js");
					},
					callbackFunc : {
						selectEvent : function(parent, data) {

							$("#combo_srlNo").val(data.srlno);
							hrTicketForm.getSnInfo($("#combo_srlNo").val());
							parent.closeWindow();
						},
					}
				});
			});



			//병원위치정보 지도 팝업
			$("#map_btn").bind("click", function(e){
				var addr = $("#addr").val();
				if(addr == null) {
					/*techUtil.alert($.gsisMsg('ts.common.msg.51'), function(){
						$("#hospital_search_btn").trigger("click");
					});*/
				} else {
					var marker = [{addr : $("#addr").val(), name : $("#pHospitalNm").val()}];
					common.googleMap.window({
						loc : {
							type : "addr", //좌표 xy
							marker :marker, //
						},
						zoom:14,
						open:function(){
						}
					});
				}

			});


			//S/N 검색 버튼
			$("#sn_search_btn").bind("click", function(e){
				var cbSrlNo = null;
				cbSrlNo = $("#combo_srlNo").val();
				console.log(cbSrlNo);
				hrTicketForm.getSnInfo(cbSrlNo);

				/*if(!$("#combo_mdlCd").val()) {
					kendo.alert($.gsisMsg('ts.common.msg.45'));
				} else {
					$("#sn_search_btn").gsisOpenWindow({
						open: function(e) {

						},
						close: function(e) {

						}
					});
				}*/
			});

			//관련정보 버튼
			$("#relate_info_btn").bind("click", function(e){
				var _hospitalId = $("#hospitalId").val();
				var setReqNo = $("#setReqNo").val();
				var _srlNo = $("#combo_srlNo").val();
				if(!_hospitalId) {
					kendo.alert($.gsisMsg('ts.common.msg.51'));
					return;
				}

				if(!_srlNo) {
					kendo.alert($.gsisMsg('ts.common.msg.44'));
					return;
				}

				console.log("00000");

				$("#dialog_componentsDetail").append("<div id='dialog_structure_stat2'></div>");

                $("#dialog_structure_stat2").gsisLoadWindow({
                    width : 1200,
                    modal : true,
                    title: "",
                    animation: {
                        close: false,
                        open: false
                    },
                    content :{
                        url : "/tech/resp/componentsPopAction.do",
                    },
                    open : function(e) {
                        // 제품구성 팝업 초기화

                        componentsPop.init({ setReqNo : setReqNo, srlNo : _srlNo });
                    },
                    close : function(){
                        this.destroy();
                    },
                });

			});

			//활성화 체크박스
			$("#check_ownerId").bind("click", function(e){
				if (this.checked) {
					techUtil.enableComboBox("combo_ownerId", true);
					techUtil.readOnlyComboBox("combo_ownerId", true);
				} else {
					techUtil.enableComboBox("combo_ownerId", false);
				}
			});

			//난수리 티켓 임시 저장 버튼
			$("#temp_ticket_save").bind("click", function(e){
				$("#ticketForm").validator(function(){
					hrTicketForm.saveTempTicket();
				});
			});

			//난수리 티켓 저장 버튼
			$("#ticket_save").bind("click", function(e){
				$("#ticketForm").validator(function(){
					//장애유형 체크
					if($("#combo_reqTypeCd").val() != 'S') {
						if(!$("#combo_errTypeCd").val()) {
							kendo.alert($.gsisMsg('ts.common.msg.53'));
							return false;
						}
					}

					hrTicketForm.saveTicket();
				});
			});

			//취소 버튼
			$("#ticket_cancel").bind("click", function(e){
				hrTicketForm.closeWindow();
			});

			//임시 저장된 테켓 삭제 버튼
			$("#ticket_delete").bind("click", function(e){
				hrTicketForm.deleteTempTicket();
			});
			// 제품군 change 이벤트
			/*$("#combo_prodGrpCd").change(function(){

				if($("#combo_prodGrpCd").val()=="DR"){
					$("#combo_ownerId").val('');
					var args1 = {
							target : "combo_ownerId",
							url : "/tech/common/drComboAjax.do",
							data : "engineerList",
							param : {prodGrpCd : $("#combo_prodGrpCd").val(), symptomM : $("#symptomM").val()},
							text : "userNm",
							value : "userNo",
							callback : function(){
								if($("#combo_ownerId").val() > 0) {
									$("#check_ownerId").prop('checked', true);
								} else {
									techUtil.enableComboBox("combo_ownerId", false);
								}
							},
							appendComboData : {
								"userNm" : techCommon.MSG.select,
								"userNo" : ""
							}
					};
					techUtil.makeCommonComboBox(args1);
				}else if($("#combo_prodGrpCd").val()=="USS"){
					$("#combo_ownerId").val('');
					var args1 = {
							target : "combo_ownerId",
							url : "/tech/common/drComboAjax.do",
							data : "engineerList",
							param : {prodGrpCd : $("#combo_prodGrpCd").val()},
							text : "userNm",
							value : "userNo",
							callback : function(){
								if($("#combo_ownerId").val() > 0) {
									$("#check_ownerId").prop('checked', true);
								} else {
									techUtil.enableComboBox("combo_ownerId", false);
								}
							},
							appendComboData : {
								"userNm" : techCommon.MSG.select,
								"userNo" : ""
							}
					};
					techUtil.makeCommonComboBox(args1);
				}else{
					$("#combo_ownerId").val('');
					var argsO = {
							target : "combo_ownerId",
							url : "/tech/common/engineerInfoListAjax/O.do",
							param : {userGbCd : techCommon.GV.userGbCd, reqUserCorpId : ""},
							data : "engineerList",
							text : "userNm",
							value : "userNo",
							callback : function(){
								if($("#combo_ownerId").val() > 0) {
									$("#check_ownerId").prop('checked', true);
								} else {
									techUtil.enableComboBox("combo_ownerId", false);
								}
							},
							appendComboData : {
								"userNm" : techCommon.MSG.select,
								"userNo" : ""
							}
					};
					techUtil.makeCommonComboBox(argsO);

				}


			});*/
		},

		/*
		 * 난수리티켓 Form 팝업창 닫기
		 */
		closeWindow : function() {
			techUtil.closeWindow("dialog_ticket_form");
		},

		/*
		 * 콤보박스 만들기
		 */
		makeComboBox : function(){
			/*if($("#combo_ownerId").val()=='0'){
			$("#combo_ownerId").val('');
			}*/
			//요청타입
			techUtil.makeSingleComboBox("combo_reqTypeCd", techCommon.CODE_URL.reqTypeCd, "Y", {codeNm : techCommon.MSG.select, codeId : ""}, function(e){
				//요청타입에 따른 처리요청정보 화면 세팅
				techUtil.setEventComboBox("combo_reqTypeCd", "change", function(e){
					var _value = this.value();

					hrTicketForm.setProcessRequestInfo(_value);
				});
			});

			//장애유형
			techUtil.makeSingleComboBox("combo_errTypeCd", techCommon.CODE_URL.errTypeCd, "Y", {codeNm : techCommon.MSG.select, codeId : ""}, function(e){
				//장애유형에 따른 화면내용 세팅
				techUtil.setEventComboBox("combo_errTypeCd", "change", function(e){
					var _value = this.value();
					if (_value == "E") {
						techUtil.setEditorValue("cfmContent", hrTicketForm._contents.E);
					} else if (_value == "P") {
						techUtil.setEditorValue("cfmContent", hrTicketForm._contents.P);
					} else if (_value == "D") {
						techUtil.setEditorValue("cfmContent", hrTicketForm._contents.D);
					} else {
						techUtil.setEditorValue("cfmContent", "");
					}
				});
			});

			//The reason for site plan
			techUtil.makeSingleComboBox("combo_sitePlanResnCd", techCommon.CODE_URL.sitePlanResnCd);

			//제품군, 제품, 모델 cascade combo
			techUtil.makeProductCascadeComboBox("combo_prodGrpCd", "combo_prodCd", "combo_mdlCd", function(){
				if(CURRENT_SRL_NO != null) {
					if($("#combo_srlNo").data("kendoComboBox")) {
						$("#combo_srlNo").data("kendoComboBox").wrapper.remove();

						var srlNoInput = '<input id="combo_srlNo" calss="k-textbox" name="srlNo" />';
						$("#srlNo_btn_group").prepend(srlNoInput);
						$("#combo_srlNo").kendoAutoComplete({
							animation: false
						});
					}
				}
			});

			//요청자

			var _reqUserCorpId = $("#reqUserCorpId").val();

			var argsR = {
					target : "combo_reqUserId",
					url : "/tech/common/engineerInfoListAjax/R.do",
					param : {userGbCd : techCommon.GV.userGbCd, reqUserCorpId : _reqUserCorpId},
					data : "engineerList",
					text : "userNm",
					value : "userNo",
					callback : function() {

						/*if($("#combo_prodGrpCd").val()=="DR"){
							$("#combo_ownerId").val('');
							var args1 = {
									target : "combo_ownerId",
									url : "/tech/common/drComboAjax.do",
									data : "engineerList",
									param : {prodGrpCd : $("#combo_prodGrpCd").val(), symptomM : $("#symptomM").val()},
									text : "userNm",
									value : "userNo",
									callback : function(){
										if($("#combo_ownerId").val() > 0) {
											$("#check_ownerId").prop('checked', true);
										} else {
											techUtil.enableComboBox("combo_ownerId", false);

										}
									},
									appendComboData : {
										"userNm" : techCommon.MSG.select,
										"userNo" : ""
									}
							};
							techUtil.makeCommonComboBox(args1);
						}else if($("#combo_prodGrpCd").val()=="USS"){
							$("#combo_ownerId").val('');
							var args1 = {
									target : "combo_ownerId",
									url : "/tech/common/drComboAjax.do",
									data : "engineerList",
									param : {prodGrpCd : $("#combo_prodGrpCd").val()},
									text : "userNm",
									value : "userNo",
									callback : function(){
										if($("#combo_ownerId").val() > 0) {
											$("#check_ownerId").prop('checked', true);
										} else {
											techUtil.enableComboBox("combo_ownerId", false);
										}
									},
									appendComboData : {
										"userNm" : techCommon.MSG.select,
										"userNo" : ""
									}
							};
							techUtil.makeCommonComboBox(args1);
						}*/


					},
					appendComboData : {
						"userNm" : techCommon.MSG.select,
						"userNo" : ""
					}
			};
			techUtil.makeCommonComboBox(argsR);
		},

		/*
		 * 에디터 만들기
		 */
		makeEditor : function() {
			techUtil.makeEditor("cfmContent");
			techUtil.makeEditor("sitePlanContent");

			//techUtil.setEditorValue("cfmContent", "");
			//techUtil.setEditorValue("sitePlanContent", "");
		},

		/*
		 * 요청 타입에 따른 처리요청정보 화면 제어
		 */
		setProcessRequestInfo : function(_reqTypeCd) {
			if (_reqTypeCd == "S") {
				$("#non_site_plan").hide();
				$("#site_plan").show();
				techUtil.initEditor("cfmContent");
				techUtil.setEditorValue("sitePlanContent", this._contents.S);
			} else {
				$("#non_site_plan").show();
				$("#site_plan").hide();

				techUtil.initEditor("sitePlanContent");
			}
		},

		/*
		 * SN 정보 가져오기
		 */
		getSnInfo : function(_hospitalId) {
			var _url = "/tech/common/selectInstalledSnListAjax.do";
			var _params = {hospitalId : _hospitalId};
			techCommon.ajax(_url, "json", _params, hrTicketFormCallback.getSnInfo);
		},

		/*
		 * SN 콤보박스 만들기
		 */
		makeSnComboBox : function(_data) {
			/*$("#combo_srlNo").data("kendoAutoComplete").wrapper.remove();*/

			//var srlNoInput = '<input id="combo_srlNo" name="srlNo" />';
			//$("#srlNo_btn_group").prepend(srlNoInput);

			var _dataSource = new kendo.data.DataSource({
				data : _data
			});

			_dataSource.fetch(function(){
				/*$("#combo_srlNo").kendoComboBox({
					dataSource : _dataSource,
					dataTextField		: "srlNo",
					dataValueField		: "srlNo",
					dataProdGrpCdField	: "prodGrpCd",
					index				: 0,
					autoWidth			: true,
					autoBind 			: true,
					select				: function(e) {
						var _index = e.item.index();
						var _item = _dataSource.data()[_index];

					    hrTicketForm.setSnSideInfo(_item);
					    CURRENT_SRL_NO = _item.srlNo;
					},
					change				: function(e){

					}
				});*/
				/*$("#combo_srlNo").attr("hidden", true);*/
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

			/*if($("#combo_prodGrpCd").val()=="DR"){
				$("#combo_ownerId").val('');
				var args1 = {
						target : "combo_ownerId",
						url : "/tech/common/drComboAjax.do",
						data : "engineerList",
						param : {prodGrpCd : $("#combo_prodGrpCd").val(), symptomM : $("#symptomM").val()},
						text : "userNm",
						value : "userNo",
						callback : function(){
							if($("#combo_ownerId").val() > 0) {
								$("#check_ownerId").prop('checked', true);
							} else {
								techUtil.enableComboBox("combo_ownerId", false);
							}
						},
						appendComboData : {
							"userNm" : techCommon.MSG.select,
							"userNo" : ""
						}
				};
				techUtil.makeCommonComboBox(args1);
			}else if($("#combo_prodGrpCd").val()=="USS"){
				$("#combo_ownerId").val('');
				var args1 = {
						target : "combo_ownerId",
						url : "/tech/common/drComboAjax.do",
						data : "engineerList",
						param : {prodGrpCd : $("#combo_prodGrpCd").val()},
						text : "userNm",
						value : "userNo",
						callback : function(){
							if($("#combo_ownerId").val() > 0) {
								$("#check_ownerId").prop('checked', true);
							} else {
								techUtil.enableComboBox("combo_ownerId", false);
							}
						},
						appendComboData : {
							"userNm" : techCommon.MSG.select,
							"userNo" : ""
						}
				};
				techUtil.makeCommonComboBox(args1);
			}else{
				$("#combo_ownerId").val('');
				var argsO = {
						target : "combo_ownerId",
						url : "/tech/common/engineerInfoListAjax/O.do",
						param : {userGbCd : techCommon.GV.userGbCd, reqUserCorpId : ""},
						data : "engineerList",
						text : "userNm",
						value : "userNo",
						callback : function(){
							if($("#combo_ownerId").val() > 0) {
								$("#check_ownerId").prop('checked', true);
							} else {
								techUtil.enableComboBox("combo_ownerId", false);
							}
						},
						appendComboData : {
							"userNm" : techCommon.MSG.select,
							"userNo" : ""
						}
				};
				techUtil.makeCommonComboBox(argsO);

			}*/


			this.setSnSideInfo(_item);
		},

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

		/*
		 * SN 콤보박스 초기화
		 */
		initSnComboBox : function() {
			CURRENT_SRL_NO = null;
			//$("#combo_prodGrpCd").data("kendoComboBox").value("");
//			if(hrTicketCommon._PARAM.snsw == "0"){
//
//			}else{
				techUtil.alert($.gsisMsg('FS-01-00-001.16'));
//			}
			hrTicketCommon._PARAM.snsw = "1";

			$("#magGlassYn").val("N");//VOC-20200710-001 난수리 티켓 화면상 설치 안된 SN 표기_[수정 요청] 난수리 티켓 정보 수리 요청
			if($("#combo_srlNo").data("kendoComboBox")) {
				$("#combo_srlNo").data("kendoComboBox").wrapper.remove();

				var srlNoInput = '<input id="combo_srlNo" calss="k-textbox" name="srlNo" readonly="readonly"/>';
				$("#srlNo_btn_group").prepend(srlNoInput);
				$("#combo_srlNo").kendoAutoComplete({
					animation: false
				});
			}
		},

		/*
		 * 난수리 티켓 저장
		 */
		saveTicket : function(){

			//VOC-20200710-001 난수리 티켓 화면상 설치 안된 SN 표기_[수정 요청] 난수리 티켓 정보 수리 요청
			if( $("#magGlassYn").val()=="" || $("#magGlassYn").val()==null){
				//$("#magGlassYn").val("N");
				//VOC-20200910-009 난수리 티켓 정보 수리 요청_시스템 S/N정보 관련
				alert($.gsisMsg('ts.common.msg.85'));
				return;
			}

			//난수리 티켓을 신청하시겠습니까?
			if(techUtil.confirm($.gsisMsg('ts.common.msg.30'), function(){
				var _url = "/tech/hrts/hrTicketSaveAjax.do";

				$("#ticketForm").find('input[name="pgStatCd"]').val("N");

				//VOC-20200710-001 난수리 티켓 화면상 설치 안된 SN 표기_[수정 요청] 난수리 티켓 정보 수리 요청
//				if( $("#magGlassYn").val()=="" || $("#magGlassYn").val()==null){
//					//$("#magGlassYn").val("N");
//					//VOC-20200910-009 난수리 티켓 정보 수리 요청_시스템 S/N정보 관련
//					alert($.gsisMsg('ts.common.msg.85'));
//					return;
//				}

				/*if($("#hrTicketFile").data("kendoUpload").options.files.length != 0){	//수정 전 등록된 첨부파일이 존재할 경우
					var fileJson = techUtil.getKendoFileListJson("hrTicketFile");
					$("#hrTicketFileJson").val(fileJson);
				}*/
				$("#sitePlanContent").val(techUtil.checkXSS($("#sitePlanContent").val()));  //XSS 체크를 이용해 특수문자를 치환
				$("#cfmContent").val(techUtil.checkXSS($("#cfmContent").val()));

				var combo_ownerId = $("#combo_ownerId").val();
				var check_ownerId = $("#check_ownerId").val();
				//소유자 체크
				/*if (check_ownerId.checked = true && combo_ownerId== ""){
					alert($.gsisMsg('ts.common.msg.50'))
					return;
				} */
				var _params = $("#ticketForm").serialize();
				techCommon.ajax(_url, "json", _params, hrTicketCommonCallback.ticketSave);
			}));
		},

		/*
		 * 난수리 티켓 임시 저장
		 */
		saveTempTicket : function(){

			if ( $("#magGlassYn").val()=="" || $("#magGlassYn").val()==null) {
				//VOC-20200910-009 난수리 티켓 정보 수리 요청_시스템 S/N정보 관련
				//$("#magGlassYn").val("N");
				alert($.gsisMsg('ts.common.msg.85'));
				return;
			}

			//난수리 티켓을 임시저장 하시겠습니까?
			if(techUtil.confirm($.gsisMsg('ts.common.msg.31'), function(){
				var _url = "/tech/hrts/hrTicketSaveAjax.do";

				//VOC-20200710-001 난수리 티켓 화면상 설치 안된 SN 표기_[수정 요청] 난수리 티켓 정보 수리 요청
//				if ( $("#magGlassYn").val()=="" || $("#magGlassYn").val()==null) {
//					//VOC-20200910-009 난수리 티켓 정보 수리 요청_시스템 S/N정보 관련
//					//$("#magGlassYn").val("N");
//					alert($.gsisMsg('ts.common.msg.85'));
//					return;
//				}

				//$("#ticketForm").find('input[name="hdTicketNo"]').val("");
				$("#ticketForm").find('input[name="pgStatCd"]').val("T");


				/*if($("#hrTicketFile").data("kendoUpload").options.files.length != 0){	//수정 전 등록된 첨부파일이 존재할 경우
					var fileJson = techUtil.getKendoFileListJson("hrTicketFile");
					$("#hrTicketFileJson").val(fileJson);
				}*/


				var _params = $("#ticketForm").serialize();

				techCommon.ajax(_url, "json", _params, hrTicketCommonCallback.ticketTempSave);
			}));
		},
		/*첨부파일 등록/수정 시 구분하면 화면을 만든다.*/
		makeUploadView : function(){
			var editFlag = true;	//티켓번호를 찍고 들어온 경우

			if(!Boolean($("#viewChk_hdTicketNo").val())){
				editFlag = false; //신청으로 들어온 경우
			}

			if(editFlag){		//수정
				var data = {
						fileNo : $("#hrTicketFileNo").val()
				}
				techCommon.ajax("/tech/hrts/selectAttachFileInfoAjax.do","json",data,function(resultData){
					if(resultData.fileUpdateInfo == null){	//파일정보가 없을 경우
						techCommon.kendoFile("hrTicketFile", "hrTicketFileTempSeq");
					}else{
						var rData = resultData.fileUpdateInfo;
						var _tempFileSeq = techCommon.getAttachFileSeqAjax();
						$("#hrTicketFileTempSeq").val(_tempFileSeq);

						techUtil.attachedFilesView({
							target : "hrTicketFile",		//element id
							saveUrl : "/common/insertTempAttchFileAjax.do",	//saveUrl
							removeUrl : "/common/deleteTempAttchFileAjax.do",	//removeUrl
							saveFileNm : rData.saveFileNm,	//저장된 파일명
							originFileNm : rData.originFileNm,	//오리지널 파일명
							fileExt : rData.fileExt, //파일확장자
							fileSize : rData.fileSize, //파일사이즈
							fileNo : rData.fileNo, //파일seq
							seq : rData.seq,		//업무단위파일seq
							autoUploadFlag : true,
							tempFileSeq : _tempFileSeq
						});
					}

				});


			}else{	//등록
				techCommon.kendoFile("hrTicketFile", "hrTicketFileTempSeq");
			}

		},
		/*
		 * 임시 난수리 티켓 삭제
		 */
		deleteTempTicket : function(){
			//삭제 하시겠습니까?
			if(techUtil.confirm($.gsisMsg('em.common.msg.004'), function(){
				var _url = "/tech/hrts/tempHrTicketDeleteAjax.do";

				var _params = $("#ticketForm").serialize();

				techCommon.ajax(_url, "json", _params, hrTicketCommonCallback.ticketTempDelete);
			}));
		}
}

//Callback
window.hrTicketFormCallback = {
		/*
		 * SN 정보 callback
		 */
		getSnInfo : function(data){
			var snInfoList = data.snInfoList;
			if(snInfoList.length > 0) {
				hrTicketForm.makeSnComboBox(snInfoList);
			} else {
				hrTicketForm.initSnComboBox();
			}
		}
}