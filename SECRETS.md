# Auth

* name: jwt-secret
  key: JWT_KEY
  value: random value
* name: stripe-secret
  key: STRIPE_KEY
  value: Found in Stripe Dashboard

kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<key_here>
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<key_here>
