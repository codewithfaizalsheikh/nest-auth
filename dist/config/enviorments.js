"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.UserRole = exports.GlobalVariable = void 0;
exports.GlobalVariable = {
    CREATE: 'Data Inserted Successfully',
    FETCH: 'Data Fetch Successfully',
    DELETE: 'Data Deleted Successfully',
    UPDATE: 'Data Updated Successfully',
    EXIST: 'Already Exist ',
    NOT_FOUND: 'Id Not Found',
    LOGIN: 'Login Successfully',
    INVALID: 'Invalid Username or Password',
    FAIL: 'Fail To Create User',
    CREATE_FAIL: 'Fail To Create',
    UPDATE_FAIL: 'Fail To Update',
    DELETE_FAIL: 'Fail To Delete',
    FETCH_FAIL: 'Fail To Fetch',
    NOT_EMPTY: 'Field Should Not Be Empty',
    MUST_STRING: 'Must Be a String',
    MUST_NUMBER: 'Must Be a Number',
    INVALID_MOBILE: 'Invalid email or email not found',
    INVALID_EMAIL: 'Invalid mobile number or mobile number not found',
    BLANK_EMAIL_MOBILE: 'Please provide email or mobile number for login.',
    INCORECT: 'Incorect Password',
    LOG_ERROR: 'Error occurred during user',
    NOT_VERIFY: 'Email is not Verified',
};
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "super admin";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
var Status;
(function (Status) {
    Status["ACTIVE"] = "active";
    Status["INACTIVE"] = "inactive";
})(Status || (exports.Status = Status = {}));
//# sourceMappingURL=enviorments.js.map