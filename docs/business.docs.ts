// ==============================================
// AUTH 페이지
// ==============================================

async function login(loginId: string, password: string) {
    this.context.사용자는_아이디와_패스워드를_검증한다(loginId, password);
    this.context.사용자의_활성화_상태를_검증한다(userId);
    this.context.사용자의_토큰을_제공한다(userId);
}

async function getProfile(token: string) {
    this.context.사용자는_토큰을_검증받는다(token);
    this.context.자신의_프로필을_조회한다(userId);
}

// ==============================================
// USER 관리 페이지
// ==============================================

async function getUserList(limit: number, page: number) {
    this.context.페이지네이션된_사용자_목록을_조회한다(limit, page);
}

async function addUserReviewPermission(departmentId: string, userId: string) {
    this.context.부서의_검토_권한에_사용자를_추가한다(departmentId, userId);
}

async function removeUserReviewPermission(departmentId: string, userId: string) {
    this.context.부서의_검토_권한에_사용자를_삭제한다(departmentId, userId);
}

async function addUserApprovalPermission(departmentId: string, userId: string) {
    this.context.부서의_리뷰_권한에_사용자를_추가한다(departmentId, userId);
}

async function removeUserApprovalPermission(departmentId: string, userId: string) {
    this.context.부서의_리뷰_권한에_사용자를_삭제한다(departmentId, userId);
}

// ==============================================
// 조직 관리 페이지
// ==============================================

async function syncOrganization() {
    this.context.부서를_업데이트하고_없는부서는_삭제한다();
    this.context.직원을_업데이트한다();
    this.context.직원_부서_중간테이블_데이터를_삭제_갱신한다();
}

async function getDepartmentList(limit: number, page: number) {
    this.context.페이지네이션된_부서_목록을_조회한다(limit, page);
}

async function toggleDepartmentExclusion(departmentId: string) {
    this.context.부서의_제외_여부를_변경한다(departmentId);
}

async function getEmployeeListByDepartment(departmentId: string, limit: number, page: number) {
    this.context.부서에_해당하는_직원_페이지네이션된_목록을_조회한다(departmentId, limit, page);
    this.context.직원들의_연차_정보를_갱신해서_보여준다();
}

async function toggleEmployeeExclusion(employeeId: string) {
    this.context.직원의_제외_여부_변경한다(employeeId);
}

async function getActiveEmployeesByDepartment(departmentId: string) {
    this.context.퇴사데이터가_있는_직원을_제외한_부서의_직원을_조회한다(departmentId);
}

// ==============================================
// 결재 페이지
// ==============================================

async function createSnapshot(departmentId: string, year: number, month: number) {
    this.context.부서의_월별_이벤트_요약을_조회한다(departmentId, year, month);
    this.context.직원의_연차_정보를_갱신_조회한다(employeeIds, year, month);
    this.context.스냅샷_하위_데이터를_생성한다(departmentId, year, month);
    this.context.스냅샷을_생성한다(departmentId, year, month);
}

async function submitApproval(snapshotId: string, userId: string) {
    this.context.해당_스냅샷_이전_요청이_있는지_검증한다(snapshotId);
    this.context.부서내의_결정권자가_없으면_검증자_부재에_대한_메세지를_내보낸다();
    this.context.결재_단계_데이터_생성한다(snapshotId, userId);
    this.context.결재_기록_데이터_생성한다(snapshotId, userId);
    this.context.스냅샷_결재_요청_데이터_생성한다(snapshotId);
}

async function getApprovalList(userId: string, limit: number, page: number) {
    this.context.결재자의_페이지네션된_전체_스냅샷_요청을_조회한다(userId, limit, page);
}

async function getApprovalDetail(snapshotId: string) {
    this.context.해당_스냅샷_요청을_조회한다(snapshotId);
}

async function processApproval(approvalId: string, userId: string, status: string) {
    this.context.결재자를_부서에_권한이있는지_검증한다(userId, departmentId);
    this.context.결재_단계_데이터를_승인_반려를_변경한다(approvalId, status);
    this.context.결재_기록_데이터를_승인_반려를_생성한다(approvalId, userId, status);
    this.context.스냅샷_결재_데이터를_승인_반려로_변경한다(snapshotId, status);
}

async function sendEmailToDepartment(departmentId: string, subject: string, content: string) {
    this.context.부서의_직원들의_이메일을_추출한다(departmentId);
    this.context.직원에게_이메일을_전송한다(employeeIds, subject, content);
}

async function getAllApprovalsByStatus(status: string, limit: number, page: number) {
    this.context.모든_스냅샷을_페이지네이션된_상태별로_조회한다(status, limit, page);
}

async function getDepartmentYearlySnapshot(departmentId: string, year: number) {
    this.context.부서의_입력연_스냅샷_데이터를_조회한다(departmentId, year);
}

async function getEmployeeMonthlySnapshot(employeeId: string, year: number, month: number) {
    this.context.직원의_입력월_스냅샷_데이터를_조회한다(employeeId, year, month);
}

async function getAllDepartmentYearlySnapshot(departmentId: string, year: number) {
    this.context.부서의_입력년_스냅샷을_조회한다(departmentId, year);
}

async function getAllEmployeeMonthlySnapshot(employeeId: string, year: number, month: number) {
    this.context.직원의_입력월_스냅샷을_조회한다(employeeId, year, month);
}

// ==============================================
// 시스템 설정 페이지
// ==============================================

async function initializeSeedData() {
    this.context.SEED_데이터_초기화_설정한다();
}

async function getAttendanceTypeList(limit: number, page: number) {
    this.context.페이지네이션된_근무_유형_목록_조회한다(limit, page);
}

async function getHolidayList(year: number, limit: number, page: number) {
    this.context.페이지네이션된_연도별_휴일_목록_조회한다(year, limit, page);
}

async function createHoliday(date: string, holidayName: string) {
    this.context.관리자는_휴일을_생성한다(date, holidayName);
    this.context.일간_이벤트_요약에_공휴일이_변경된다(date);
    this.context.월간_이벤트_요약에_공휴일이_변경된다(year, month);
}

async function updateHoliday(holidayId: string, date: string, holidayName: string) {
    this.context.휴일_ID를_체크한다(holidayId);
    this.context.관리자는_휴일을_업데이트한다(holidayId, date, holidayName);
    this.context.일간_이벤트_요약에_공휴일이_변경된다(date);
    this.context.월간_이벤트_요약에_공휴일이_변경된다(year, month);
}

async function deleteHoliday(holidayId: string) {
    this.context.휴일_ID를_체크한다(holidayId);
    this.context.관리자는_휴일을_삭제한다(holidayId);
    this.context.일간_이벤트_요약에_공휴일이_변경된다(date);
    this.context.월간_이벤트_요약에_공휴일이_변경된다(year, month);
}

// ==============================================
// 파일 관리 페이지
// ==============================================

async function uploadExcelFile(year: number, month: number) {
    this.context.S3로_단일_파일_업로드한다(year, month);
}

async function createFileProcess(
    userId: string,
    eventFileId: string,
    attendanceFileId: string,
    year: number,
    month: number,
) {
    this.context.파일_프로세스를_생성한다(userId, eventFileId, attendanceFileId, year, month);
}

async function updateFileProcess(
    processId: string,
    status: string,
    departmentInfo: any,
    employeeInfoJson: any,
    dataJson: any,
    selectedDataJson: any,
) {
    this.context.프로세스가_있는지_검증_조회한다(processId);
    this.context.프로세스의_상태를_변경_저장한다(
        processId,
        status,
        departmentInfo,
        employeeInfoJson,
        dataJson,
        selectedDataJson,
    );
}

async function getCurrentProcess(year: number, month: number) {
    this.context.관리자가_진행_중인_프로세스_조회한다(year, month);
}

async function applyFileProcess(processId: string) {
    this.context.프로세스를_조회한다(processId);
    this.context.상태_검증을_한다(processId);
    this.context.파일의_데이터의_날짜와_등록된_파일의_날짜_검증한다(processId);
    this.context.파일의_필드가_출입에_관련된_파일인지_검증한다(processId);
    this.context.존재_하지_않는_직원_업체의_정보_추출한다(processId);
    this.context.존재_하지_않는_직원_업체와_부서의_정보_저장한다(processId);
    this.context.선택된_직원_리스트를_추출한다(processId);
    this.context.출입_이벤트_저장한다(employeeIds, year, month);
    this.context.연차_공휴일_근태를_정리한_사용된근태를_저장한다(employeeIds, year, month);
    this.context.직원들의_일별_이벤트_요약_생성한다(employeeIds, year, month);
    this.context.직원들의_월별_이벤트_요약_생성한다(employeeIds, year, month);
}

async function getFilesByMonth(year: number, month: number) {
    this.context.해당월_파일_리스트_조회한다(year, month);
}

async function deleteFile(fileId: string) {
    this.context.업로드_파일을_삭제한다(fileId);
}

async function deleteAllFilesByMonth(year: number, month: number) {
    this.context.해당월_업로드_파일_조회한다(year, month);
    this.context.해당파일_전체_삭제한다(fileIds);
}

async function downloadFile(fileId: string) {
    this.context.파일을_검증한다(fileId);
    this.context.파일을_다운로드_한다(fileId);
}
