/**
 * 기술지원 난수리 티켓 공통 자바스크립트
*/

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
			$("#ticket_reg_btn").bind("click", function(){

				hrTicketCommon.openFormPopup();
			});

			$("#ticket_info").bind("click", function(){
				hrTicketCommon.openViewPopup();
			});
		},

		/* 난수리티켓 신청 폼 팝업 */
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


		/* 난수리티켓 상세 팝업 */
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

		/*
		 * 난수리 티켓 목록 그리드 만들기
		 */
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
		          	    	//hrTicketList.makeChart();
		          	    	$("#totalCnt").html(_dataSource.total());
							//kendo.bind($("#totalCnt"),{"totalCnt":_dataSource.total()});
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


			/*_dataSource.fetch(function(){
				$("#totalCnt").html(_dataSource.total());
			});*/


			/*$("#" + _target).kendoGrid({
				dataSource : {
					transport : {
						read : {
			          	    url				: "/tech/hrts/hrTicketListAjax.do",
			          	    dataType		: "json",
			          	    data 			: _params,
			          	    sendDataType 	: "string",
			          	    type			: "POST",
			          	    complete:function(){
								// 총 카운트
			          	    	//hrTicketList.makeChart();
			          	    	$("#totalCnt").html(_dataSource.total());
								//kendo.bind($("#totalCnt"),{"totalCnt":_dataSource.total()});
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
				},
				columns 	: _columns,
				pageable	: true,
				selectable	: false,
		        reorderable: true,
				resizable: true,
				sortable: true,
		        noRecords 	: {template : techCommon.MSG.nodata},
		        change		: _change
			});*/

		},

		/*
		 * 난수리 티켓 목록 그리드 만들기 No paging
		 */
		makeHrTicketGridNopaging :  function (_target, _params, _columns, _change) {
			$("#" + _target).kendoGrid({
				dataSource : {
					transport : {
						read : {
							url				: "/tech/hrts/hrTicketCurrentListAjax.do",
			          	    dataType		: "json",
			          	    data 			: _params,
			          	    sendDataType 	: "string",
			          	    type			: "POST",
			          	    error			: function(e){
			          	    	 techUtil.alert("Status: " + e.status + "; Error message: " + e.errorThrown);
							}
			            }
					},
					schema: {
			        	data	: "list"
			        }
				},
				columns 	: _columns,
		        selectable	: false,
		        reorderable: true,
				resizable: true,
				sortable: true,
		        //sortable	: true,
		        noRecords 	: {template : techCommon.MSG.nodata},
		        change		: _change
			});
		},

		/*
		 * 난수리 티켓 목록 그리드 만들기 No paging
		 */
		makeHrTicketGridNopaging2 :  function (_target, _params, _columns, _change) {
			$("#" + _target).kendoGrid({
				dataSource : {
					transport : {
						read : {
							url				: "/tech/hrts/hrTicketDashboardListAjax.do",
			          	    dataType		: "json",
			          	    data 			: _params,
			          	    sendDataType 	: "string",
			          	    type			: "POST",
			          	    error			: function(e){
			          	    	 techUtil.alert("Status: " + e.status + "; Error message: " + e.errorThrown);
							}
			            }
					},
					aggregate: [
					            { field: "stsOpen", aggregate: "sum" },
					            { field: "resolved", aggregate: "sum" },
					            { field: "closed", aggregate: "sum" },
					            { field: "tat", aggregate: "sum" }

					        ],
					schema: {
			        	data	: "list"
			        }

				},

				columns 	: _columns,
		        selectable	: false,
		        reorderable: true,
				resizable: true,
				sortable: true,
		        //sortable	: true,
		        noRecords 	: {template : techCommon.MSG.nodata},
		        change		: _change
			});
		},

		/*
		 * 난수리 티켓 목록 그리드 만들기 No paging
		 */
		makeHrTicketGridNopaging3 :  function (_target, _params, _columns, _change) {
			$("#" + _target).kendoGrid({
				dataSource : {
					transport : {
						read : {
							url				: "/tech/hrts/hrDashboardConditionListAjax.do",
			          	    dataType		: "json",
			          	    data 			: _params,
			          	    sendDataType 	: "string",
			          	    type			: "POST",
			          	    error			: function(e){
			          	    	 techUtil.alert("Status: " + e.status + "; Error message: " + e.errorThrown);
							}
			            }
					},
					schema: {
			        	data	: "list"
			        }

				},

				columns 	: _columns,
		        selectable	: false,
		        reorderable: true,
				resizable: true,
				sortable: true,
		        //sortable	: true,
		        noRecords 	: {template : techCommon.MSG.nodata},
		        change		: _change
			});
		},



		/*
		 * 난수리 티켓 정보 호출
		 */
		callTicketInfo : function(_hdTicketNo, _pgStatCd,reqUserId,ownerId){

			//난수리 티켓 번호 전역변수에 저장
			hrTicketCommon._PARAM.hdTicketNo = _hdTicketNo;
			hrTicketCommon._PARAM.reqUserId = reqUserId;
			hrTicketCommon._PARAM.ownerId = ownerId;
			hrTicketCommon._PARAM.snsw = "0";
			console.log(_pgStatCd);
			console.log(hrTicketCommon._PARAM.hdTicketNo);
			console.log(hrTicketCommon._PARAM.ownerId);
			if (_pgStatCd == 'T') {
				//임시 난수리 티켓일때 전역변수에 title 저장
				hrTicketCommon._PARAM.title = $.gsisMsg('ts.01.01.003.25');
				/**/
				$("#ticket_reg_btn").trigger("click");
				//hrTicketCommon.openFormPopup2();

			} else {
				if(_pgStatCd == 'N' && TS_AUTH == 'HQ' && hrTicketCommon._PARAM.currentPage == 'list') {
					hrTicketList.list();
					hrTicketList.makeChart();
				}

				$("#ticket_info").trigger("click");
			}
		},

		/*
		 * 티켓 목록 갱신
		 */
		refresh : function(){
			//techMain 이면 pass
			if (hrTicketCommon._PARAM.currentPage != "techMain") {
				//dashboard 인지 list 인지 체크
				console.log(hrTicketCommon._PARAM.currentPage);
				if (hrTicketCommon._PARAM.currentPage == "dashboard") {
					hrTicketDashboard.list1();
					hrTicketDashboard.list2();
				} else {
					hrTicketList.refresh();
				}
			}
		}
}

//Callback
window.hrTicketCommonCallback = {
		/*
		 * 난수리 티켓 저장 callback
		 */
		ticketSave : function(data) {
			if(data.result == "200") {
				//난수리 티켓을 신청하였습니다.
				techUtil.alert($.gsisMsg('ts.common.msg.33'), function(){

					try {
						hrTicketCommon.refresh();
					}
					catch (e) {

					}




					hrTicketForm.closeWindow();
				});
			} else {
				kendo.alert($.gsisMsg('ts.common.msg.21', $.gsisMsg('ts.common.msg.35')));
			}
		},

		/*
		 * 난수리 티켓 임시저장 callback
		 */
		ticketTempSave : function(data) {
				if(data.result == "200") {
				//난수리 티켓을 임시저장 하였습니다.
				techUtil.alert($.gsisMsg('ts.common.msg.34'), function(){
					try {
						hrTicketCommon.refresh();
					}
					catch (e) {

					}
					hrTicketForm.closeWindow();
				});
			} else {
				//저장중 오류가 발생 하였습니다.
				kendo.alert($.gsisMsg('ts.common.msg.21', $.gsisMsg('ts.common.msg.22')));
			}
		},

		/*
		 * 임시 난수리 티켓 삭제 callback
		 */
		ticketTempDelete : function(data) {
				if(data.result == "200") {
				// 삭제 하였습니다.
				techUtil.alert($.gsisMsg('em.common.msg.005'), function(){
					try {
						hrTicketCommon.refresh();
					}
					catch (e) {

					}
					hrTicketForm.closeWindow();
				});
			} else {
				//삭제 중 오류가 발생 하였습니다.
				kendo.alert($.gsisMsg('ts.common.msg.21', $.gsisMsg('ts.common.msg.25')));
			}
		}
}