# API
This service is responsible for exposing the public API to the outside world. It also hosts the Swagger documentation.

# Auth
This service is responsible for handling user signup, signin and signout. It also takes care of user security such as handling phone number verification and enabling and disabling of two factor authentication.

# Cart
This service is responsible for holding users' and guests' shopping carts. It handles editing quantity of items, removing items and emptying the cart all together.

# Categories
This service is responsible for holding product categories.

# Expiration
This service is responsible for watching order and payment expiration.

# Logs
This service is responsible for collecting logs.

# Media
This service is responsible for media management. For now it only supports uploading a single image to an S3 compatible backend.

# Notifications
This service is responsible for sending out notifications. For now it supports sending out verification emails and SMS.

# Orders
This service is responsible for handling users' orders.

# Payments
This service is responsible for handling users' payments.

# Products
This service is responsible for holding products.