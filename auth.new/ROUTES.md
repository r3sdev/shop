# Old
GET     /api
GET     /api/users/currentuser 
POST    /api/users/signin
POST    /api/users/signout
POST    /api/users/signup

POST    /api/users/2fa/disable
POST    /api/users/2fa/enable
POST    /api/users/2fa/generate
POST    /api/users/2fa/validate

POST    /api/users/forgot-password
GET     /api/users/reset-password/:token
POST    /api/users/reset-password

POST    /api/users/verify-email/:token
POST    /api/users/phone-number/verification/validate
POST    /api/users/phone-number/remove
POST    /api/users/phone-number/verification/request
POST    /api/users/backup-code/verify
POST    /api/users/backup-code/send

# New
GET     /api/auth/signin
POST    /api/auth/signin
POST    /api/auth/signup
DELETE  /api/auth/signout

GET     /api/auth/password/new
GET     /api/auth/password/edit
PUT     /api/auth/password
POST    /api/auth/password

GET     /api/auth/confirmation/new
GET     /api/auth/confirmation
POST    /api/auth/confirmation