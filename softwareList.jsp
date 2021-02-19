<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="en">
<!-- 상단 INCLUDE -->

<!-- Common Header : 필수-->
<%@ include file="/WEB-INF/jsp/gsis/common/commonHeader.jsp"%>
<!-- Common Header : 필수 -->

<body class="page-header-fixed page-sidebar-closed-hide-logo page-content-white">

<!-- Common Menu : 필수-->
	<%@include file="/WEB-INF/jsp/gsis/common/commonMenu.jsp"%>
<!-- Common Menu : 필수-->

<!-- 상단 공통 검색 / 가로세로 보기 : 선택  -->
	<%@include file="/WEB-INF/jsp/gsis/common/commonSearchBar.jsp"%>
<!-- openViewer('/common/js/field/fild/OZReportTrainingBook_ver70.pdf'); -->

						<!-- 상세검색영역 시작 -->
						<div class="content_search_wrap">
							<div class="k-grid k-widget k-row-normal">
								<table class="k-selectable">
									<tbody role="rowgroup">
										<tr>
											<td>
												<table class="inner_sch_box" style="width:auto;">
												<tr role="row">
													<td class="s_header s_first">
														<!-- 제품군 -->
														<spring:message code="FS-02-03-003.1" />
													</td>
													<td>
														<input id="schProdGrpCd" name="prodGrpCd" />
													</td>
													<td class="s_header">
														<!-- 제품 -->
														<spring:message code="FS-02-03-003.2" />
													</td>
													<td>
														<input id="schProdCd" name="prodCd" />
													</td>
													<td class="s_header">
														<!-- 등록기간 -->
														<spring:message code="FS-02-03-003.3" />
													</td>
													<td>
														<span class="date_period_field">
															<input class="ip_start" name="startDate" style="width:110px;">
															<span> ~ </span>
															<input class="ip_end" name="endDate" style="width:110px;">
														</span>
													</td>
												</tr>
												<tr role="row">
													<td class="s_header s_first">
														<!-- 제목 -->
														<spring:message code="FS-02-03-004.5" />	
													</td>
													<td>
														<input class="k-textbox" name="title">
													</td>
													<td class="s_header">
														<!-- 속성 -->
														<spring:message code="FS-02-03-004.6" />	
													</td>
													<td>
														<input id="schAttr" name="attrCd"/>
													</td>
												</tr>
												</table>
											</td>
											<td class="btn_detail_srch">
												<button class="btn_default k-primary" id="detailSearch" type="button">
													<!-- 상세조회 -->
													<spring:message code="FS-02-03-003.5" />
												</button>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<!-- 상세검색영역 끝 -->
						<%-- <div>
								<div class="contentsRow">
									<div class="tit_wrap_grid">
										<h4 class="tit2dep pull-left">Software</h4>
									</div>
									<!-- 그리드컨트롤 시작 -->
									<div class="cont-header">
										<span class="total header-total-count"><spring:message code="FS-02-03-003.6" /> <em class="totalCount" data-bind="text:totalCount"><!-- 26 --></em></span>
									</div>
									<!-- 그리드컨트롤 끝 -->
									<!-- 버튼 시작 -->
									<div class="button-top-set">
										<button class="btn_excel_download" type="button" id="excelDownload">
											<!-- 엑셀 다운로드 -->
											<spring:message code="FS-02-03-003.7" />
										</button>
										<button type='button' class='btn_edit k-button' id="btn_edit">
											<!-- 수정 -->
											<spring:message code="FS-02-03-003.8" />
										</button>
										<button type='button' class='btn_regist k-button' id="btn_regist">
											<!-- 등록 -->
											<spring:message code="FS-02-03-003.9" />
										</button> <!-- data-id='dialog_SM_reg' data-width='800' data-title='자재분해도 등록 / 수정' -->
										<button class="btn_del" type="button" id="deleteBtn">
											<!-- 삭제 -->
											<spring:message code="FS-02-03-003.10" />
										</button>
										<button class="btn_reset" type="button" id="gridRefresh">
											<!-- 새로고침 -->
											<spring:message code="FS-02-03-003.11" />
										</button>
										<button class="btn_config" type="button" id="button_icon_setting">
											<!-- Configuration -->
											<spring:message code="FS-02-03-003.12" />
										</button>
									</div>
									<!-- 버튼 끝 -->
								</div>
								<div class="contentsRow">
									<!-- 그리드 시작 -->
									<div id="softwareGrid"></div>
									<!-- 그리드 끝 -->
								</div>
							</div> --%>
						<div id="splitter"></div>
						<!-- 리스트영역 시작 -->
						<div id="pane_A" style="display:none;">
							<div>
								<div class="contentsRow">
									<div class="tit_wrap_grid">
										<h4 class="tit2dep pull-left">Software<span style="color:red;">    [Before you use this SW, you should check if it is approved in your country]</span></h4>
									</div>
									<!-- 그리드컨트롤 시작 -->
									<div class="cont-header">
										<span class="total header-total-count"><spring:message code="FS-02-03-003.6" /> <em class="totalCount" data-bind="text:totalCount"><!-- 26 --></em></span>
									</div>
									<!-- 그리드컨트롤 끝 -->
									<!-- 버튼 시작 -->
									<div class="button-top-set">
										<!-- <button class="btn_edit" type="button" id="oracleCloudEdit">
											대용량 수정
										</button>
										<button class="btn_regist" type="button" id="oracleCloudReg">
											대용량 등록
										</button> -->
										<button class="btn_excel_download" type="button" id="excelDownload" data-auth="excel">
											<!-- 엑셀 다운로드 -->
											<spring:message code="FS-02-03-003.7" />
										</button>
										<c:choose>
											<c:when test="${'Y' == sessionScope[LOGIN_SESSION_KEY].natureFileEditYn}">
												<%-- <button type='button' class='btn_edit k-button' id="btn_edit">
													<!-- 수정 -->
													<spring:message code="FS-02-03-003.8" />
												</button>
												<button type='button' class='btn_regist k-button' id="btn_regist">
													<!-- 등록 -->
													<spring:message code="FS-02-03-003.9" />
												</button> --%>
												<button class="btn_edit" type="button" id="oracleCloudEdit" data-auth="edit">
													<!-- 수정 -->
													<spring:message code="FS-02-03-003.8" />
												</button>
												<button class="btn_regist" type="button" id="oracleCloudReg" data-auth="save">
													<!-- 등록 -->
													<spring:message code="FS-02-03-003.9" />
												</button>
												<button class="btn_del" type="button" id="deleteBtn" data-auth="delete">
													<!-- 삭제 -->
													<spring:message code="FS-02-03-003.10" />
												</button>
											</c:when>
											<c:otherwise>
												<button class="btn_edit" type="button" id="oracleCloudEdit" data-auth="edit" style="display:none;">
													<!-- 수정 -->
													<spring:message code="FS-02-03-003.8" />
												</button>
												<button class="btn_regist" type="button" id="oracleCloudReg" data-auth="save" style="display:none;">
													<!-- 등록 -->
													<spring:message code="FS-02-03-003.9" />
												</button>
												<button class="btn_del" type="button" id="deleteBtn" data-auth="delete" style="display:none;">
													<!-- 삭제 -->
													<spring:message code="FS-02-03-003.10" />
												</button>
											</c:otherwise>
										</c:choose>	
										<button class="btn_reset" type="button" id="gridRefresh">
											<!-- 새로고침 -->
											<spring:message code="FS-02-03-003.11" />
										</button>
										<button class="btn_config" type="button" id="button_icon_setting">
											<!-- Configuration -->
											<spring:message code="FS-02-03-003.12" />
										</button>
									</div>
									<!-- 버튼 끝 -->
								</div>
								<div class="contentsRow">
									<!-- 그리드 시작 -->
									<div id="softwareGrid"></div>
									<!-- 그리드 끝 -->
								</div>
							</div>
						</div>
						<!-- 리스트영역 끝 -->
						<!-- 상세영역 시작 -->
						<div id="pane_B" style="display:none;">
							<<!-- div>
								<div class="contentsRow">
									<div class="tit_wrap_grid">
										<h4 class="tit2dep">
											Software	
										</h4>
									</div>
									<div id="bar_chart" style="height:200px;"></div>
								</div>
						</div> -->
						<!-- 리스트영역 끝 -->
<!-- 상단 공통 검색 / 가로세로 보기 : 선택  -->
<!-- 하단 INCLUDE 영역 -->
			<!-- Right Panel : 필수 -->
			<%@ include file="/WEB-INF/jsp/gsis/common/commonRightPanel.jsp"%>
			<!-- Right Panel : 필수 -->
		<!-- 컨텐츠 끝 -->
		<!-- Quick Nav : 필수 -->
		<%@ include file="/WEB-INF/jsp/gsis/common/commonQuickNav.jsp"%>
		<!-- Quick Nav : 필수 -->
		<div id="dialog_SM_reg" style="display:none;"></div>
		<div id="dialog_software" style="display:none;"></div>
		
<!-- 하단 INCLUDE 영역 -->
<script type="text/javascript" src="/common/js/field/common/field_common.js?ver=${cachever}"></script>
<script src="/common/js/field/fild/softwareList.js?ver=${cachever}" type="text/javascript"></script> 
<!-- <script src="/common/js/field/fild/softwareList.js" type="text/javascript"></script> -->
    <script type="text/javascript" src="/static/cloud/js/FileSaver.min.js"></script>
    <script type="text/javascript" src="/static/cloud/js/all.fine-uploader.js"></script>
    <script type="text/javascript" src="/static/cloud/js/all.yps-downloader.js"></script>
</body>
</html>