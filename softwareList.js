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

/**
 * 상세조회 버튼 클릭 이벤트
 * @param input_area 싱세검색 조건 전체를 감싸는 Element
 * @param paramGrid  검색 후 데이터 그릴 그리드
 */
function detailSearch(input_area, paramGrid){
	//search_area
	var arr = new Array();
	$(input_area).find("input").each(function(){
		var name = this.name;
		var value = this.value!=undefined?this.value:"";
		if(name.toUpperCase().indexOf("DATE") > -1){
			value = value.replaceAll(".","-");
		}
		if(value != ""){
			software.GV.searchKey[name] = value;
		}else{
			delete software.GV.searchKey[name];
		}
	});
	var len = arr.length;
	for(var i=0;i<len;i++){
		var tmp = arr[i];
		if(software.GV.searchKey[tmp] != undefined){
			delete software.GV.searchKey[tmp];
		}
	}
	paramGrid.dataSource.read();
};


function changeVersionInput(){
	var firstVersDesc = $(software.GV.popVersionGrid.element).find("tbody").find("tr:eq(0)").find(".popVersionDesc");
	var cell = $(firstVersDesc).closest("td");
	var $input = $("<input />");
	var attribute = {"type":"text", "name":"popVersionDesc", "class":"k-textbox"};
	$input.attr(attribute);
	$input.appendTo(cell);
	$(firstVersDesc).remove();
}
/**
 * 필드서비스 > 서비스 블루틴 > 등록.수정팝업 버전그리드 초기화.
 * @param versionData 버전정보 그리드에 들어갈 데이터. ( 등록일 땐 강제로 한 줄 생성, 수정일 땐 데이터 + 강제로 한줄 만들어서 파리미터로 넘김)
 */
function popVersionGridInit (versionData){
	var ops = {
			gridOps : {
				columns: [
					{
						field: $.gsisMsg("FS-02-03-003.54"),//"버전이력",
						title: "",
						columns: [
							/*{
								headerTemplate: "<input type='checkbox' onclick='fieldUtil.elementToggleAll(event, \"#popVersionGrid\");'  />",
								template: "<input type='checkbox' data-bind='checked: checked' />",
								width: 30
							}
							,*/{ field: "versNo", title: "Version"}
							,{ field: "regDt", title: $.gsisMsg("FS-02-03-003.42")}
							,{ field: "regUserNm", title: $.gsisMsg("FS-02-03-003.43")}
							,{ field: "description", title: $.gsisMsg("FS-02-03-003.21"), template:"<span class=\"popVersionDesc\"> #: description #</span>"}
							,{ field: "regUserId", title: $.gsisMsg("FS-02-03-003.44"), hidden:true}
					]}
				]
				,dataSource: {
					data: versionData != null ? versionData:[]
					,selectable:false
					,pageSize:2
				}
				,selectable:false
				,serverPaging:true
				,pageSize:5
				,pageable:{
					change : function(e){
							var idx = e.index!=undefined?e.index:"1";
							if(idx === "1"){
								changeVersionInput();
							}
					}
				}
		} //ops.gridOps
	}
	software.GV.popVersionGrid = gridInit(ops, $("#popVersionGrid"));
	// template: "<input class='k-textbox' name=\"popVersionDesc\"  value=\"#: description #\">"
	changeVersionInput();
}
/**
 * Exploded View 삭제
 * @param paramGrid
 * @returns {Boolean}
 */
function deleteSoftware(paramGrid){
	var checkedLen = 0;
	var arr = new Array();
	$(paramGrid.element).find("input[type=\"checkbox\"]").each(function(){
		var isChecked = $(this).is(":checked");
		var idx = $(this).closest("tr").index();
		if(isChecked){
			checkedLen++;
			var name = "seqNo_"+idx;
			software.GV.destroyParam[name] = paramGrid.dataSource.at(idx).seqNo;
			arr.push(paramGrid.dataItem($(this).closest("tr")));
		}
	});
	if(checkedLen > 0){
		var size = arr.length;
		for(var i=0;i<size;i++){
			paramGrid.dataSource.remove(arr[i]);
		}
		paramGrid.dataSource.sync();
	}else{
		fieldUtil.alert($.gsisMsg("FS-02-03-005-3.42"));//삭제할 Software 정보를 선택하세요.
		return false;
	}
	paramGrid.dataSource.read();
}
/**
 * 파라미터로 받은 그리드 다시 읽음.
 * @param paramGrid
 */
function gridRefresh(paramGrid){
	if(paramGrid.dataSource != undefined){
		paramGrid.dataSource.read();
	}
}
/**
 * 상세보기 첨부파일 그리드
 * @param fileNo
 */
function setDetailAttachGrid(fileNo){
	var params = {"job":"attach","fileNo":fileNo}
	var arr = new Array();
	fieldUtil.ajaxJson({
		url : "/field/fild/softwareAjax.do",
		type: "POST",
		data: JSON.parse(JSON.stringify(params)),
		async:false,
		success : function(r){
			var returnArr = r.dataMapList;
			var size = returnArr.length;
			if(size > 0){
				for(var i=0;i<size;i++){
					arr.push(returnArr[i]);
				}
			}else{
				arr = [];
			}
		},
		error : function(){
			//var msg = (division == "prodCd" ? $.gsisMsg("FS-02-03-004.2"):$.gsisMsg("FS-02-03-004.1")) + $.gsisMsg("FS-02-03-004.52");
			var msg = $.gsisMsg("FS-02-03-003.46");//첨부파일 조회 실패
			fieldUtil.alert(msg);
		}
	});
	var ops = {
			gridOps : {
				columns: [
							{
								headerTemplate: "<input type='checkbox' onclick='toggleAll(event)' />",
								template: "<input type='checkbox' data-bind='checked: checked' />",
								width: 30
							},
							{ field: "originFileNm", title: $.gsisMsg("FS-02-03-003.55")},//"첨부파일명"
							{ field: "regDt", title:$.gsisMsg("FS-02-03-003.56")  }//"첨부날짜"
						],
						dataSource: {
							data: arr,
						},
						scrollable: false
						,noRecords : {template : $.gsisMsg("FS-02-03-003.47")}//데이터가 없습니다.
		} //ops.gridOps
	}
	software.GV.detailAttachGrid = gridInit(ops, $("#detailAttachGrid"));
}
/**
 * 상세보기 버전그리드
 * @param seqNo
 */
function setDetailVersionGrid(seqNo){
	var params = {"job":"version","seqNo":seqNo}
	var ops = {
			gridOps : {
				columns: [
							{
								field: "버전이력",
								title: "",
								columns: [
									/*{
										headerTemplate: "<input type='checkbox' onclick='fieldUtil.elementToggleAll(event, \"#popVersionGrid\");'  />",
										template: "<input type='checkbox' data-bind='checked: checked' />",
										width: 30
									}*/
									/*,*/{ field: "versNo", title: "Version"}
									,{ field: "regDt", title: $.gsisMsg("FS-02-03-003.42")}
									,{ field: "regUserNm", title: $.gsisMsg("FS-02-03-003.43")}
									,{ field: "description", title: $.gsisMsg("FS-02-03-003.21"), template:"<span class=\"popVersionDesc\"> #: description #</span>"}
									,{ field: "regUserId", title: $.gsisMsg("FS-02-03-003.44"), hidden:true}
							]}
						],
						autoBind:false
						,serverPaging:true
						,pageSize:5
						,batch: true
			}
			,dsOps : {
				transport :{
					read : {
						url : "/field/fild/softwareAjax.do",
						dataType : "json",
						data :JSON.parse(JSON.stringify(params)),
						complete :  function(){
							software.GV.searchKey["job"] = "list";
						}
					},
					parameterMap: function(options) {
						var obj = $.extend(	true,params,options,{"job":"version"}	);
						return obj;
					}
				},
				schema : {
					data : "detailVersionList",
					total : "detailVersionListCount",
					model : {
						id : "subSeqNo"
					}
				},serverPaging:true
				,pageSize:5
		}
	}
	software.GV.detailVersionGrid = gridInit(ops, $("#detailVersionGrid"));
	software.GV.detailVersionGrid.dataSource.read();
}

/** 차트 데이터 개수 **/
var chartLength = "5";
/** 파이 차트 기본 옵션 **/
var pieChartOptions = {
		"type": "pie",
		"theme": "light",
		"valueField": "cnt",
		"titleField": "prodGrpCd",
		"outlineAlpha": 0.4,
		"depth3D": 15,
		"balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
		"angle": 30
};
/** 막대차트 기본 옵션 **/
var barChartOptions = {
		"type": "serial",
		"rotate": true,
		"categoryField": "prodGrpCd",
		"autoMarginOffset": 13,
		"marginRight": 13,
		"startDuration": 1,
		"fontSize": 13,
		"theme": "default",
		"addClassNames": true,
		"colors": [
			"#f1e3a4",
			"#ff6d34"
		],
		"categoryAxis": {
			"gridAlpha": 0,
			"borderAlpha": 0,
			"axisAlpha": 1
		},
		"valueAxes": [
			{
				"id": "ValueAxis-1",
				"stackType": "regular",
				"gridAlpha": 0,
				"axisAlpha": 0,
				"labelsEnabled": false
			}
		],
		"balloon": {
			"borderAlpha": 1,
			"borderThickness": 1,
			"fillAlpha": 1,
			"fillColor": "#f1f1f1"
		},
		"graphs": [
			{
				"columnWidth": 0.5,
				"fillAlphas": 1,
				"id": "AmGraph-14",
				"title": $.gsisMsg("FS-02-03-003.57"),//"완료",
				"type": "column",
				"valueField": "cnt"
			}
		]
}

/**
 * 차트 데이터 구함.
 * @param 차튿데이터 개수
 * @return Array[Object]
 */
function getDataProvider(dataLength){
	var paramMap = {"rnum":dataLength}
	var data = new Array();
	fieldUtil.ajaxJson({
			url : "/field/fild/softwareChartAjax.do",
			type: "POST",
			async:false,
			data : JSON.parse(JSON.stringify(paramMap)),
			success:function(r){
				var returnData = r.chartData;
				var size = returnData.length;
				for(var i=0;i<size;i++){
					data.push(returnData[i]);
				}
			}
		});
	return data;
};

/**
 * 서비스 블루틴 조회수 올림.
 * @param seqNo
 */
function updateHits(seqNo){
	var params = {"seqNo":seqNo};
	$.ajax({
		url:"/field/fild/updateHits.do",
		type:"POST",
		async:false,
		data:JSON.parse(JSON.stringify(params)),
		error:function(e){}
	});
}


var software = {
		GV : {
			/** 전역변수 **/
			searchKey : {}			// 상세검색 파라미터
			,softwareGrid : null	// Exploded View 그리드
			,detailVersionGrid:null	// 상세보기 버전정보
			,detailAttachGrid:null	// 상세보기 첨부파일 그리드
			,popVersionGrid:null	// 등록.수정팝업 버전그리드
			,isEdit : false			// 수정인지, 등록인지
			,destroyParam : {"job":"delete"}//Exploded View 그리드 삭제 파라미터
			,isChangeAttach : false // 첨부파일 수정여부 ( 그리드가 달라서 hasChanges() 함수로 캐치 못함 )
			,editItem : {}			// 수정하려는 data object
			,isUploading : false	// 대용량 파일 업로드 중인지 아닌지
		},
		init : function(){
			/** 초기화 시작 **/
			software.dropdownInit.set();

			software.popupInit();

			$("input[name=\"startDate\"]").val("");

			//enter 이벤트
		    enterEvent($(".content_search_wrap"),"detailSearch");

			var gridOptions = {
					gridOps : {
						columns: loadGridCoumns("softwareGrid",[
									{
										headerTemplate: "<input type='checkbox' onclick='fieldUtil.elementToggleAll(event, \"#softwareGrid\");' />",
										template: "<input type='checkbox' data-bind='checked: checked' />",
										width: 30
									},
									{ field: "attrNm", title: $.gsisMsg("FS-02-03-004.6")/*"기술지원유형"*/, origin:true },
									{ field: "prodGrpCd", title: $.gsisMsg("FS-02-03-003.1")/*"제품군"*/ },
									{ field: "prodCd", title: $.gsisMsg("FS-02-03-003.2")/*"제품"*/ },
									//{ field: "title", title: $.gsisMsg("FS-02-03-003.4")/*"제목"*/ },
									{ field: "title", title: $.gsisMsg("FS-02-03-003.4"), attributes: { class:"align_l"}, width:"400px"},
									{ field: "vers", title: "Version" },
									{ field: "regDt", title: $.gsisMsg("FS-02-03-003.16")/*"등록일"*/ },
									{ field: "regUserNm", title: $.gsisMsg("FS-02-03-003.17")/*"등록자" */},
									{ field: "updateDt", title: $.gsisMsg("FS-02-03-003.18")/*"수정일"*/ },
									//{ field: "updateUserNm", title: $.gsisMsg("FS-02-03-003.19")/*"수정자"*/ },
									{ field: "inquCnt", title:$.gsisMsg("FS-02-03-003.48")/* "조회수" */}
									,{ field: "techType", title: $.gsisMsg("FS-02-03-003.58")/*"기술지원유형"*/, hidden:true, origin:true}
									,{ field: "supportGb", title: $.gsisMsg("FS-02-03-003.59")/*"유형"*/, hidden:true, origin:true}
									,{ field: "comment", title: "comment",hidden:true, origin:true }/* lhj add */

								]),
								scrollable: false
								,autoBind:false
								,resizable: true
								,change : function(){
									var grid = this;
									var obj = grid.dataSource.at(grid.select().index());

									updateHits(obj.seqNo);

									common.softwareSearch.window({
									       target : $(this),
									       position: undefined,
									       depth : 2,
									       title:"Software",
									       minWidth:1000,
									       multiCheck : false,
									       open : function(){

									       },
									       callbackFunc : function(obj) {

									       },
									       seqNo : obj.seqNo,
									       fileNo: obj.fileNo
									    });
									grid.dataSource.read();
								}
					},
					dsOps : {
						transport :{
							read : {
								url : "/field/fild/softwareAjax.do",
								dataType : "json",
								type:"POST",
								data : $.extend(true, software.GV.searchKey,software.GV.searchKey,{"job":"list"}),
								complete:function(){
									kendo.bind(".totalCount",{"totalCount":software.GV.softwareGrid.dataSource.total()});
								}
							},
							destroy : {
								url: "/field/fild/softwareAjax.do",
								dataType: "json",
								type:"POST",
								data: software.GV.destroyParam,
								complete:function(r){}
							},
							parameterMap: function(options,operation) {
								if("destroy" == operation){
									software.GV.destroyParam = $.extend(true,{},software.GV.destroyParam,{"job":"delete"});
									return software.GV.destroyParam;
								}else{
									$.extend(true,software.GV.searchKey, options, {});
									return software.GV.searchKey;
								}//
							}
						},
						schema : {
							data : "softwareList",
							total : "softwareListCount",
							model : {
								id : "seqNo"
							}
						}
						,serverPaging:true
						,pageSize : 10
						,dataBinding : function(e){
							if ("rebind" !== e.action) { // 등록, 수정, 삭제 시 grid 적용 안함
								e.preventDefault();
							}
						}
						,dataBound : function(e) {
							kendo.bind(".totalCount", {"totalCount" : this.dataSource.total()});
						}
					}
			};
			software.GV.softwareGrid = gridInit(gridOptions, $("#softwareGrid"));
			software.GV.softwareGrid.dataSource.read();

			$(".detailView").hide();

			//software.chartInit();
			/** 초기화 끝 **/
		} // init end
		,chartInit : function(){
			/** 차트 초기화 **/
			AmCharts.makeChart("bar_chart",$.extend(true,{},barChartOptions,{"dataProvider":getDataProvider(chartLength)}));
		}
		,popupInit : function(){
			/** 팝업 초기화 **/


			/** 등록 팝업 시작 **/
			$("#oracleCloudReg").gsisOpenWindow({
				id : "dialog_SM_reg",
				title : $.gsisMsg("FS-02-03-005-3.40"),//"Software 등록"
				content : "/field/fild/oracleCloudForm.do",
				width:1000,
				minWidth:1000,
				height:650,
				actions:["open"],
				open : function() {
					kendo.ui.progress($("body"), true);
					software.GV.isEdit = false;

					/** 상단부 X 버튼 **/
					/*var $x = $("<p />");
					$x.attr({"id":"popClose","style": "width:21px; height:21px; position:absolute; right:20px; top:15px; z-index:9999; margin:0; background:url(/static/common/img/common/btn_close.png) 0 -45px no-repeat; cursor:pointer;"});
					$x.appendTo($("#dialog_SM_reg").data("kendoWindow").element.prev());*/


					$("#popVersion").val("1.0");
					setDropDown($("#popProdGrpCd"),software.dropdownInit.prodGrpList,software.dropdownInit.prodOps("prodGrpCd"));
					setDropDown($("#popProdCd"),software.dropdownInit.prodList,software.dropdownInit.prodOps("prodCd"));
					setDropDown($("#popAttr"),software.dropdownInit.attrList,software.dropdownInit.comCodeOps);
					var versionInit =  [{"versNo":$("#popVersion").val() ,"regDt": getToday(), "regUserNm": $("#popUserNm").val(),"regUserId":$("#popUserId").val(),"description":"" } ];
					popVersionGridInit(versionInit);

					$("#popProdGrpCd").bind("change",function(){
          				setDropDown($("#popProdCd"),getProdInfo("prodCd",$(this).val()) ,software.dropdownInit.prodOps("prodCd"));
          			});

					$("#kupload1_raonFileSeq").val("");

					//raonupload 이벤트 호출
					raonUploadSettingOption("uploadHolder1","kupload1",'0','0',"400px");
				},
				close : function(e) {
					kendo.ui.progress($("body"), false);
					$("#loadingprogress").hide();

					software.GV.isChangeAttach = false;
					software.GV.softwareGrid.dataSource.cancelChanges();
				},
				preventDefault : function(){

				}
			});


			/** 수정팝업 시작 **/
			$("#oracleCloudEdit").gsisOpenWindow({
				id : "dialog_SM_reg",
				title : $.gsisMsg("FS-02-03-005-3.41"),//"Software 수정"
				content : "/field/fild/oracleCloudForm.do",
				width:1000,
				minWidth:1000,
				height:650,
				actions:["open"],
				open : function() {

					kendo.ui.progress($("body"), true);

					/** 수정, 등록 구분 전역변수 설정 값 변경 **/
					software.GV.isEdit = true;

					/** 상단부 X 버튼 **/
					/*var $x = $("<p />");
					$x.attr({"id":"popClose","style": "width:21px; height:21px; position:absolute; right:20px; top:15px; z-index:9999; margin:0; background:url(/static/common/img/common/btn_close.png) 0 -45px no-repeat; cursor:pointer;"});
					$x.appendTo($("#dialog_SM_reg").data("kendoWindow").element.prev());*/


					/** kendo dropdown 설정 **/
					/** 제품군 **/
					setDropDown($("#popProdGrpCd"),software.dropdownInit.prodGrpList,software.dropdownInit.prodOps("prodGrpCd"));

					console.log(software.dropdownInit.prodList);
					console.log(software.dropdownInit.prodOps("prodCd"));
					/** 제품 **/
					//수정시 아래 쪽에서 데이터 입력시 제품군 코드값 입력받아서 selectBox 데이터 생성
					//setDropDown($("#popProdCd"),software.dropdownInit.prodList,software.dropdownInit.prodOps("prodCd"));
					/** 속성 **/
					setDropDown($("#popAttr"),software.dropdownInit.attrList,software.dropdownInit.comCodeOps);

					/** 등록, 수정 팝업 버전 그리드 설정 **/
					var versionInit =  [{"versNo":$("#popVersion").val() ,"regDt": getToday(), "regUserNm": $("#popUserNm").val(),"regUserId":$("#popUserId").val(),"description":"" } ];
					popVersionGridInit(versionInit);

					/** 팝업에 있는 kendo dropdown change event bind **/
					//수정시 셀렉트 박스 데이터 나오도록 change 이벤트 강재 호출
					$("#popProdGrpCd").bind("change",function(){
          				setDropDown($("#popProdCd"),getProdInfo("prodCd",$(this).val()) ,software.dropdownInit.prodOps("prodCd"));
          			});


					/** 체크박스 개수 확인 및 바인딩 할 오브젝트 설정 **/
					//var software.GV.editItem = {};
					var checkedLen = 0;
					$(software.GV.softwareGrid.element).find("input[type=\"checkbox\"]").each(function(){
						var isChecked = $(this).is(":checked");
						if(isChecked){
							checkedLen++;
							var idx = $(this).closest("tr").index();
							software.GV.editItem = software.GV.softwareGrid.dataSource.at(idx).toJSON();
						}
					});

					if(checkedLen == 1){
						//제품 셀렉트 박스 나오도록 데이터 입력
						setDropDown($("#popProdCd"),getProdInfo("prodCd",software.GV.editItem.prodGrpCd) ,software.dropdownInit.prodOps("prodCd"));

						kendo.bind($("#popWrap"),software.GV.editItem);
						/** 버전정보 ( 기존 버전 + 0.1 ) **/
						var vers = software.GV.editItem.vers;
          				var versNo = (parseFloat(vers) + 0.1).toFixed(1);
          				$("#popVersion").val(versNo);

          				/** 팝업 버전 그리드 설정 **/
          				var paramMap ={"seqNo":software.GV.editItem.seqNo,"job":"version"};
          				fieldUtil.ajaxJson({
          					url : "/field/fild/softwareAjax.do",
          					type: "POST",
          					async:false,
          					data : JSON.parse(JSON.stringify(paramMap)),
          					success:function(r){
          						var versionInit =  [{"versNo":$("#popVersion").val() ,"regDt": getToday(), "regUserNm": $("#popUserNm").val(),"regUserId":$("#popUserId").val(),"description":"" } ];
          						versionInit = $.merge(versionInit,r.detailVersionList);
          						popVersionGridInit(versionInit);
          						paramMap = {};
          					}
          				});

          				/******************************* 팝업 첨부파일 설정 ***************************************/
          				/** 파일 조회 시 필요한 매개변수 **/
          				var paramMap = {"fileNo":software.GV.editItem.fileNo};
          				var fileObj = {};

          				$("#kupload1_raonFileSeq").val(software.GV.editItem.fileNo);

          				//raonupload 이벤트 호출
          				raonUploadSettingOption("uploadHolder1","kupload1",'0','0',"400px");


					}else{
						fieldUtil.alert($.gsisMsg("FS-02-03-005-3.37"));//수정할 소프트웨어 하나를 선택해주세요.
						return false;
					}



				},
				close : function() {
					kendo.ui.progress($("body"), false);
					$("#loadingprogress").hide();

					software.GV.isChangeAttach = false;
					software.GV.softwareGrid.dataSource.cancelChanges();
				},
				preventDefault : function(){

					var checkedLen = 0;
					$(software.GV.softwareGrid.element).find("input[type=\"checkbox\"]").each(function(){
						var isChecked = $(this).is(":checked");
						if(isChecked){
							checkedLen++;
							var idx = $(this).closest("tr").index();
							software.GV.editItem = software.GV.softwareGrid.dataSource.at(idx).toJSON();
						}
					});

					var isPreventDefault = false;
					if(checkedLen > 1){
						isPreventDefault = true;
						fieldUtil.alert($.gsisMsg("FS-02-03-005-3.38"));//수정할 소프트웨어 하나를 체크해주세요.
					}else if(checkedLen == 0){
						isPreventDefault = true;
						fieldUtil.alert($.gsisMsg("FS-02-03-005-3.39"));//수정할 소프트웨어 정보를 체크해주세요.
					}
					return isPreventDefault;

				}
			});


		}
		,dropdownInit : {
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
            },
            set :function(){
            	 		// 상세검색 영역
	          			setDropDown($("#schProdCd"),software.dropdownInit.prodList,software.dropdownInit.prodOps("prodCd"));
	          			setDropDown($("#schProdGrpCd"),software.dropdownInit.prodGrpList,software.dropdownInit.prodOps("prodGrpCd"));
	          			setDropDown($("#schAttr"),software.dropdownInit.attrList,software.dropdownInit.comCodeOps);
	          		}
			}
}

/**
 * 그리드 초기화 함수
 * @param options : 그리드 옵션. ( 기본옵션과 겹치는 부분은 파라미터로 온 옵션이 적용 )
 * @param el	  : 그리드 element
 * @returns
 */
function gridInit(options, el){
	var defaultDS = {
			transport: {
				parameterMap: function(options) {
					var obj = {"take":options.take,"skip":options.skip,"page":options.page,"pageSize":options.pageSize};
					var params = $.extend(true, {}, obj, software.GV.searchKey);
					return params;
				}
			},
			error: function (e) {
				fieldUtil.alert("Status: " + e.status + "; Error message: " + e.errorThrown);
			},
			serverPaging: true,
			pageSize: 10,
			batch:true
	};
	var initDS = $.extend(true,{},defaultDS, options.dsOps);
	var dataSource =  new kendo.data.DataSource(initDS);
	var defaultGridOps = {
			columns : [],
			scrollable: false,
			noRecords : {template : $.gsisMsg("FS-02-03-003.47")/*"데이터가 없습니다."*/},
			pageable: true,
			autoBind:true,
            dataBound : function() {
				//kendo.bind(".totalCount", {totalCount : this.dataSource.total()});
			},
			dataBinding : function(e){
				if( "rebind" !== e.action){	// 등록, 수정, 삭제 시 grid 적용 안함
					e.preventDefault();
				}
			},
			dataSource: {data : []},
			selectable:true
		};

	var initGridOps = $.extend(true,{},defaultGridOps,options.gridOps);
	var grid = $(el).kendoGrid(initGridOps);

	/** grid.dataSource에 transport가 있을수도 없을수도 있어서 조건처리함. **/
	if(options.dsOps != undefined){
		if(options.dsOps.transport != undefined){
			if(options.dsOps.transport.read != undefined){
				grid.data("kendoGrid").setDataSource(dataSource);
			}
		}
	}
	return grid.data("kendoGrid");
}
/**
 * 파라미터로 온 el 아래에 있는 input 기준으로
 * input의 division + input name을 key로, input의 value를 value로 만들어 object 리턴.
 * @param division  리턴되는 object의 key 앞에 붙일 구분자
 * @param el		input을 감싸는 Element
 * @returns {___anonymous24848_24849}
 */
function setParameter(division, el){
	var obj = {};
	var name = "";
	//contentWrap
	$(el).find("input").each(function(){
		name = $(this).attr("name") != undefined ? $(this).attr("name"):"";
		if("" != name){
			var tmpName = division + name;
			if($(this).attr("type") != "file"){
				obj[tmpName] = $(this).val();
			}else{
				obj[name] = $(this).val();
			}
		}
	});
	return obj;
}



$(function(){
	/** 초기화 **/
	software.init();

	/** 제품군 dropdown 변경 시 선택한 제품군 하위 제품을 제품 dropdown에 세팅 **/
	$("#schProdGrpCd").bind("change",function(){
		setDropDown($("#schProdCd"),getProdInfo("prodCd",$(this).val()) ,software.dropdownInit.prodOps("prodCd"));
	});

	/** 그리드 새로고침 **/
	$("#gridRefresh").click(function(){
		gridRefresh(software.GV.softwareGrid);
	});
	$("#button_icon_setting").on("click", function(){
	    common.userField.window({
		target:this,
		position : "target right",
		grid : "softwareGrid",
	    })
	});

	/** 등록, 수정버튼 저장버튼 이벤트 **/
	$(document).on("click","#saveExploded",function(e){
		var isUpload = undefined != software.GV.isUploading ? software.GV.isUploading : false;
		if(!isUpload){

			$("#popWrap").validator(function(e){
				var contentsInfo = setParameter("E",$("#contentWrap"));
				/*var fileInfo = setParameter("",$("#hiddenArea"));
				if("9999" != $("removeFile").data('removefile')){
					fileInfo["removeFileSeq"] = $("#removeFile").data("removefile");
				}*/
				var confirmMsg = $.gsisMsg("FS-02-03-003.50");//"하시겠습니까?";
				var resultMsg = "";
				var jobStr = "";
				var jobStrBefore = "";
				var params = {"job":""}
				if(software.GV.isEdit){
					//jobStr = $.gsisMsg("FS-02-03-003.8");//"수정"; Edit
					jobStr = $.gsisMsg("FS-01-04-001.52");//"수정되었습니다"; Changed successfully.  2020.06.07, VOC-20200520-004,서비스 기술자료 내용 업데이트시 업데이트 되지 않아도 완료되었다고 팝업 뜸
					jobStrBefore = $.gsisMsg("FS-02-03-003.8");//"수정"; Edit
					params.job = "update";
				}else{
					//jobStr = $.gsisMsg("FS-02-03-003.9");//"등록"; Register
					jobStr = $.gsisMsg("FS-01-04-001.58");//"등록되었습니다." ; Registered successfully 2020.06.07, VOC-20200520-004,서비스 기술자료 내용 업데이트시 업데이트 되지 않아도 완료되었다고 팝업 뜸
					jobStrBefore = $.gsisMsg("FS-02-03-003.9");//"등록"; Register
					params.job = "insert";
				}
				//confirmMsg = jobStr + " " + confirmMsg;
				confirmMsg = jobStrBefore + " " + confirmMsg;

				fieldUtil.confirm(confirmMsg,function(){
					var hasChanges = false;
					if(software.GV.isEdit){
						$("td.dataRow").each(function(){
							var keyArr = Object.keys(software.GV.editItem);
							var keyLen = keyArr.length;
							var name = "";
							loop:
							for(var i=0;i<keyLen;i++){
								name =  $(this).find("input").attr("name");
								if(software.GV.editItem[name] != undefined){
									hasChanges = software.GV.editItem[name] ==  $(this).find("input").val() ? false : true;
								}
								//
								if(hasChanges){
									break loop;
								}
							}
						});
						if(!hasChanges){
							hasChanges = software.GV.editItem.description ==  $("#popDescription").data("kendoEditor").value()  ? false : true;
						}
						/*if(!hasChanges && !software.GV.isChangeAttach){
							fieldUtil.alert($.gsisMsg("FS-02-03-003.51"));"변경된 내용이 없습니다."
							return false;
						}*/
					}
					params["Edescription"] = $("#popDescription").data("kendoEditor").value();
					var versionInfo =  software.GV.popVersionGrid.dataItems()[0].toJSON();
					var keyArr = Object.keys(versionInfo);
					var keyLen = keyArr.length;
					division = "V";
					for(var i=0;i<keyLen;i++){
						var keyName = keyArr[i];
						tmpName = division + keyName;
						params[tmpName] = versionInfo[keyName];
					}
					tmpName = division + "description";
					var versionDesc = $(software.GV.popVersionGrid.element).find("input[name=\"popVersionDesc\"]");
					params[tmpName] = $(versionDesc[0]).val();
					params = $.extend(true,params,contentsInfo);
					/*var fileLength = $("div.k-upload").find("ul.k-upload-files").find("li.k-file") != undefined ? $("div.k-upload").find("ul.k-upload-files").find("li.k-file").length:0;
					params["fileLength"] = fileLength;*/
					params["fileNo"] = $("#kupload1_raonFileSeq").val();
					params["raonFileUuidList"] = $("#kupload1_uuidList").val();
					//
					fieldUtil.ajaxJson({
							url : "/field/fild/softwareAjax.do",
							type: "POST",
							async:false,
							data : JSON.parse(JSON.stringify(params)),
							success:function(r){
								//alert("r.result>>"+r.result);
								if(r.result){
									resultMsg = jobStr //+ " " + $.gsisMsg("FS-02-03-003.52")//"되었습니다.";
								}else{
									resultMsg = $.gsisMsg("customer.mob.common.166")
								}
							},
							error : function(){
								//resultMsg = jobStr //+ " " + $.gsisMsg("FS-02-03-003.53")//"에 실패하였습니다.";
								resultMsg = $.gsisMsg("customer.mob.common.166")
							}
						});
					fieldUtil.alert(resultMsg);
					software.GV.softwareGrid.dataSource.read();
					kendo.ui.progress($("body"),false);
					if($("#dialog_SM_reg").data("kendoWindow") != undefined){
						$("#dialog_SM_reg").data("kendoWindow").close();
					}
				},function(){
					software.GV.softwareGrid.dataSource.cancelChanges();
				});
			});
		}else{
			e.preventDefault();
			fieldUtil.alert($.gsisMsg("FS-02-03-001.56"));//업로드 중입니다. 잠시만 기다려주세요.
		}
	});

	/** PDF 열기 버튼 이벤트 **/
	$(document).on("click",".openPdf",function(){
		var idx = $(this).closest("tr").index();
		var fileNo = software.GV.softwareGrid.dataSource.at(idx).fileNo;
		openViewer(fileNo);
	});

	/** 상세조회 버튼 이벤트 **/
	$("#detailSearch").click(function(){
		detailSearch($(".content_search_wrap"),software.GV.softwareGrid);
	});

	/** 엑셀 다운로드 버튼 이벤트 **/
	$("#excelDownload").click(function() {
		var searchObj = {
			"startDate" : $("input[name=\"startDate\"]").val(),
			"endDate" : $("input[name=\"endDate\"]").val()
		};

		if ($("input[name=\"title\"]").val() != "") {
			searchObj["title"] = $("input[name=\"title\"]").val();
		}
		if ($("input[name=\"prodGrpCd\"]").val() != "") {
			searchObj["prodGrpCd"] = $("input[name=\"prodGrpCd\"]").val();
		}
		if ($("input[name=\"prodCd\"]").val() != "") {
			searchObj["prodCd"] = $("input[name=\"prodCd\"]").val();
		}

		var url = "/field/fild/softwareExcel.do";
		excelDownload(searchObj, software.GV.softwareGrid, url);
	});

	/** 삭제버튼 이벤트 **/
	$("#deleteBtn").click(function(){
		fieldUtil.confirm($.gsisMsg("FS-02-03-001.40"),function(){
			deleteSoftware(software.GV.softwareGrid);
		});
	});

	$(document).on("click","#cancelExploded",function(){
		kendo.ui.progress($("body"), false);
		$("#loadingprogress").hide();

		$("#dialog_SM_reg").data("kendoWindow").close();

		i/*f(software.GV.isUploading){
			fieldUtil.alert($.gsisMsg("FS-02-03-001.56"));//클라우드 서버와 동기화 중입니다. 잠시만 기다려주세요.
			return false;
		}
		if( $("#dialog_SM_reg").data("kendoWindow") != undefined ){
			var el = $("#dialog_SM_reg").data("kendoWindow");
			//kendo.ui.progress(el.element, true);
			$("#loadingprogress").show();
			setTimeout(function(){
				var tempUuid = $("#tempUuid").val();
				var fileNo = $("#fileNo").val();
				var isEdit = software.GV.isEdit ? "Y":"N";
				var paramMap = {"fileNo":fileNo, "isEdit":isEdit, "uuids":tempUuid};
				if("" != tempUuid){
					$.ajax({
						url : "/cancelUpload.do"
						,type:"POST"
						,async:false
						,dataType:"json"
						,data:JSON.parse(JSON.stringify(paramMap))
						,success:function(r){}
						,error:function(xhr){}
					});
				}
				$("#dialog_SM_reg").data("kendoWindow").close();
				kendo.ui.progress($("body"),false);
				$("#loadingprogress").hide();
			},1000);
		}*/
	});

	/** 대용량 KendoWindow 상단 X 버튼 이벤트 **/
	$(document).on("click","#popClose", function(){
		$("#dialog_SM_reg").data("kendoWindow").close();
		kendo.ui.progress($("body"), false);
		$("#loadingprogress").hide();
	});


});


//업로드 생성완료 이벤트
function OracleCloud_CreationComplete(uploadID, oracleCloudJobID) {
    console.log('업로드 생성 완료 : jobId => ' + oracleCloudJobID);
    console.log('업로드 생성 완료 : uploadID => ' + uploadID);

	if("kupload1" == uploadID || "kdownload1" == uploadID){
		//RAONKUPLOAD.Hidden("uploadHolder1");
		if("kdownload1" == uploadID){
			//다운로드만 가능하도록 설정
			RAONKUPLOAD.SetUploadMode("view", "kdownload1");
		}

		//대용량 다운로드 파일 리스트 조회

	    $.ajax({
		    url : "/common/getFileListInfo.do",
		    async:false,
			dataType : "json",
			type: 'POST',
			data : {
				fileNo : $("#"+uploadID+"_raonFileSeq").val()
			},
			error: function(){

			},
			success: function(r){
				//console.log(r);
				var fileList = r.resultMap;
				//console.log(fileList);
				if(fileList.length > 0){
					//헤더에 인증 정보 추가
				    RAONKUPLOAD.AddHttpHeader("Authorization", "Basic Z3Npcy5jb21tb25AcGFydG5lci5zYW1zdW5nLmNvbTpTYW1zdW5nMSE=", uploadID);

				    var uuidList = "";
					for(var n=0;n<fileList.length;n++){
						//RAONKUPLOAD.AddUploadedFile(fileList[n].qqUuid, fileList[n].qqFileName, 'https://mhme-a430673.documents.us2.oraclecloud.com/documents/api/1.2/files/'+fileList[n].qqUuid+'/data/', fileList[n].qqTotalFileSize, '', uploadID);

						RAONKUPLOAD.AddUploadedFile(
								fileList[n].qqUuid,
								fileList[n].qqFileName,
								'https://gsisfile.samsunghealthcare.com/kdownload?guid='+fileList[n].qqUuid,
								fileList[n].qqTotalFileSize,
								'',
								uploadID);


						uuidList = uuidList + fileList[n].qqUuid + "|";
					}
					$("#"+uploadID+"_uuidList").val(uuidList);

				}


			}
		});

	}



}